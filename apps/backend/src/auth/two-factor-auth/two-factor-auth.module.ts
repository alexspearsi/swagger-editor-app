import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailService } from '../../libs/mail/mail.service';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  imports: [PrismaModule],
  providers: [TwoFactorAuthService, MailService],
})
export class TwoFactorAuthModule {}
