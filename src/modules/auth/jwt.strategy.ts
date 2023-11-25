import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Roles } from './roles.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiation: false,
      secretOrKey: 'hiden-me',
    });
  }
  async validate(payload: any) {
    console.log('\t-> payload: ', payload);
    return {
      username: payload.username,
      roles: payload.roles,
    };
  }
}
