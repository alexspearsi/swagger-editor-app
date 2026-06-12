import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    UserModule,
    forwardRef(() => EmailConfirmationModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    MailService,
    TwoFactorAuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
