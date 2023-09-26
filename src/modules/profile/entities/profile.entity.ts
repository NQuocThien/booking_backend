import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class Profile {
  @Field({ nullable: true })
  introduce: string

  @Field()
  userId: string


  @Field({ nullable: true })
  skills: string

  @Field(() => [User], { nullable: true })
  user: User[]
}
export const ProfileSchema = SchemaFactory.createForClass(Profile)