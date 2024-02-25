import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schema/user.schema';
// import { ProfileModule } from '../profile/profile.module';
import { CustomerModule } from '../customer/customer.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule,
    UsersModule,
    CustomerModule,
    // ProfileModule,
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
      secret: 'hiden-me',
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    UsersService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
