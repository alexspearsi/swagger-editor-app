import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { MailModule } from './libs/mail/mail.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.getOrThrow('GOOGLE_RECAPTCHA_SECRET_KEY'),
        response: (req) => req.headers.recaptcha,
        skipIf: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    EmailConfirmationModule,
    MailModule,
    PasswordRecoveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
