import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class Profile {
  @Field((type) => ID)
  id: String;

  @Field({ nullable: true })
  introduce: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  skills: string;

  @Field({ nullable: true })
  skills1: string;

  @Field(() => [User], { nullable: true })
  user: User[];
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);
