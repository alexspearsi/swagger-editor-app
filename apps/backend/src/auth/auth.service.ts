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
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly TOKEN_EXPIRE_TIME;
  private readonly TOKEN_REFRESH_EXPIRE_TIME;
  private readonly JWT_SECRET_KEY;
  private readonly JWT_SECRET_REFRESH_KEY;
  private readonly CRYPT_SALT;

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
    this.CRYPT_SALT = Number(this.configService.getOrThrow('CRYPT_SALT'));
  }

  async signup(dto: AuthRequestDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new ConflictException('Such user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.CRYPT_SALT);

    const newUser = await this.prismaService.user.create({
      data: { email, passwordHash: hashedPassword },
    });

    return { id: newUser.id, email: newUser.email };
  }

  async signin(dto: AuthRequestDto) {
    const { email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existUser) {
      throw new ForbiddenException('Credentials are not correct');
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existUser.passwordHash,
    );

    if (!isValidPassword) {
      throw new ForbiddenException('Credentials are not correct');
    }

    const tokens = this.createTokens(existUser);
    await this.saveRefreshTokenHash(existUser.id, tokens.refreshToken);

    return tokens;
  }

  private createTokens({ id, email }: { id: number; email: string }) {
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

  private async saveRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, this.CRYPT_SALT);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
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

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!tokenMatches) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }

    const tokens = this.createTokens(user);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.prismaService.user.updateMany({
      where: { id: userId, refreshTokenHash: { not: null } },
      data: { refreshTokenHash: null },
    });
  }
}
