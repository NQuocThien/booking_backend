import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { Experience } from './experience';
import { Certificate } from './certificate';
import { Prize } from './Prize';
import { Education } from './education';
import { SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class Profile {
  @Field({nullable: true})
  introduce: string

  @Field()
  userId: string

  @Field({nullable: true})
  experience: Experience

  @Field({nullable: true})
  skills: string

  @Field({nullable: true})
  certificate: Certificate // chứng chỉ

  @Field({nullable: true})
  education: Education

  @Field({nullable: true})
  prize: Prize    

  @Field(() => [User], {nullable: true})
  user: User[]
}
export const ProfileSchema = SchemaFactory.createForClass(Profile)