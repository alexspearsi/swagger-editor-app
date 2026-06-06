import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { JwtPayload } from './interfaces/jwt.interface';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';

@Injectable()
export class AuthService {
  private readonly TOKEN_EXPIRE_TIME;
  private readonly TOKEN_REFRESH_EXPIRE_TIME;
  private readonly JWT_SECRET_KEY;
  private readonly JWT_SECRET_REFRESH_KEY;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
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

  async register(dto: RegisterDto) {
    const isExist = await this.userService.findByEmail(dto.email);

    if (isExist) {
      throw new ConflictException(
        `Регистрация не удалась. Пользователь с таким email уже существует.
         Пожалуйста, используйте другой email или войдите в систему.`,
      );
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      false,
    );

    await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      message: `Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. 
      Сообщение было отправлено на ваш почтовый адрес.`,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.passwordHash) {
      throw new NotFoundException(
        `Пользователь не найден. Пожалуйста, проверьте введенные данные`,
      );
    }

    const isValidPassword = await verify(user.passwordHash, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его.',
      );
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);

      throw new UnauthorizedException(
        `Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.`,
      );
    }

    // if (user.isTwoFactorEnabled) {
    //   if (!dto.code) {
    //     await this.twoFactorAuthService.sendTwoFactorToken(user.email);

    //     return {
    //       message:
    //         'Проверьте вашу почту. Требуется код двухфакторной аутентификации.',
    //     };
    //   }

    //   await this.twoFactorAuthService.validateTwoFactorToken(user.email);
    // }

    const tokens = this.createTokens(user);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async issueTokens(user: { id: string; email: string }) {
    const tokens = this.createTokens(user);

    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

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
