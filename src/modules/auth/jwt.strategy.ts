import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hiden-me',
    });
  }
  async validate(payload: any) {
    console.log('\t-> payload: ', payload.username, payload.roles);
    return {
      username: payload.username,
      roles: payload.roles,
    };
  }
}
