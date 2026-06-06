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
import { AuthRequestDto } from './dto/auth-request.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from './guards/auth.guard';
import { COOKIE_OPTIONS } from '../common/constants/cookie';

const REFRESH_COOKIE = 'refresh_token';
const ACCESS_COOKIE = 'access_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthRequestDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res({ passthrough: true }) res: express.Response,
    @Body() dto: AuthRequestDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signin(dto);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000,
    });

    return { accessToken };
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
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken: string = req.cookies[REFRESH_COOKIE] ?? '';

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    res.cookie(REFRESH_COOKIE, newRefreshToken, COOKIE_OPTIONS);
    res.cookie(ACCESS_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000,
    });

    return { message: 'Tokens refreshed' };
  }
}
