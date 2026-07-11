import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';

import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  public constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));

    return this.sendMail(email, 'Email Confirmation', html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, 'Password Reset', html);
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    const html = await render(TwoFactorAuthTemplate({ token }));

    return this.sendMail(email, 'Two-Factor Authentication Code', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.resend.emails.send({
      from: this.configService.getOrThrow<string>('MAIL_FROM'),
      to: email,
      subject,
      html,
    });
  }
}
