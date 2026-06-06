import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => req?.cookies?.access_token ?? null,
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET_KEY'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return await this.authService.validate(payload);
  }
}
