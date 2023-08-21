import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ])
],
  providers: [UsersResolver, UsersService],
  exports: [UsersService], 
})
export class UsersModule {}
