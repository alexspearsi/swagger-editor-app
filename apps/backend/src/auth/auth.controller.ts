import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from './guards/auth.guard';
import { COOKIE_OPTIONS } from '../common/constants/cookie';
import type { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_COOKIE = 'refresh_token';
const ACCESS_COOKIE = 'access_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: express.Response,
    @Body() dto: LoginDto,
  ) {
    const result = await this.authService.login(dto);

    if ('message' in result) {
      return result;
    }

    this.setTokenCookies(res, result.refreshToken, result.accessToken);

    return { message: 'Токены сохранены в cookies успешно.' };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) res: express.Response,
    @CurrentUser() user: { id: string },
  ) {
    await this.authService.logout(user.id);

    res.clearCookie(REFRESH_COOKIE);
    res.clearCookie(ACCESS_COOKIE);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken: string = req.cookies[REFRESH_COOKIE] ?? '';

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    this.setTokenCookies(res, newRefreshToken, newAccessToken);

    return { message: 'Tokens refreshed' };
  }

  private setTokenCookies(
    res: Response,
    refreshToken: string,
    accessToken: string,
  ) {
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000,
    });
  }
}
