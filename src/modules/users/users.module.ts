import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { ProfileModule } from '../profile/profile.module';
@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
    forwardRef(() => ProfileModule)
    // ProfileModule
],
  providers: [UsersResolver, UsersService],
  exports: [UsersService], 
})
export class UsersModule {}
