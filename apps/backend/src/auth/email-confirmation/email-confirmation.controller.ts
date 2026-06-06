import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationDto } from './dto/confirmation.dto';
import { COOKIE_OPTIONS } from '../../common/constants/cookie';

const REFRESH_COOKIE = 'refresh_token';
const ACCESS_COOKIE = 'access_token';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerification(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ConfirmationDto,
  ) {
    const { accessToken, refreshToken } =
      await this.emailConfirmationService.newVerification(dto);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000,
    });

    return { message: 'Email подтверждён. Токены сохранены в cookies.' };
  }
}
