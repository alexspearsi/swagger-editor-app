import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequestDto } from './dto/auth-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly TOKEN_EXPIRE_TIME;
  private readonly TOKEN_REFRESH_EXPIRE_TIME;
  private readonly JWT_SECRET_KEY;
  private readonly JWT_SECRET_REFRESH_KEY;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.TOKEN_EXPIRE_TIME = this.configService.getOrThrow('TOKEN_EXPIRE_TIME');
    this.TOKEN_REFRESH_EXPIRE_TIME = this.configService.getOrThrow(
      'TOKEN_REFRESH_EXPIRE_TIME',
    );
    this.JWT_SECRET_KEY = this.configService.getOrThrow('JWT_SECRET_KEY');
    this.JWT_SECRET_REFRESH_KEY = this.configService.getOrThrow(
      'JWT_SECRET_REFRESH_KEY',
    );
  }

  async signup(dto: AuthRequestDto) {
    const { email, password, name } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new ConflictException('Such user already exists');
    }

    const hashedPassword = await hash(password);

    const newUser = await this.prismaService.user.create({
      data: { email, passwordHash: hashedPassword, displayName: name },
    });

    return { id: newUser.id, email: newUser.email, name: newUser.displayName };
  }

  async signin(dto: AuthRequestDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existUser) {
      throw new ForbiddenException('Credentials are not correct');
    }

    const isValidPassword = await verify(existUser.passwordHash, password);

    if (!isValidPassword) {
      throw new ForbiddenException('Credentials are not correct');
    }

    const tokens = this.createTokens(existUser);
    await this.saveRefreshTokenHash(existUser.id, tokens.refreshToken);

    return tokens;
  }

  private createTokens({ id, email }: { id: string; email: string }) {
    const payload: JwtPayload = { userId: id, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.JWT_SECRET_KEY,
      expiresIn: this.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.JWT_SECRET_REFRESH_KEY,
      expiresIn: this.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshTokenHash(userId: string, refreshToken: string) {
    const tokenHash = await hash(refreshToken);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshTokenHash: tokenHash },
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.JWT_SECRET_REFRESH_KEY,
      });
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const tokenMatches = await verify(user.refreshTokenHash, refreshToken);

    if (!tokenMatches) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const tokens = this.createTokens(user);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prismaService.user.updateMany({
      where: { id: userId, refreshTokenHash: { not: null } },
      data: { refreshTokenHash: null },
    });
  }
}
