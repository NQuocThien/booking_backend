import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Prize {
  @Field()
  name: string

  @Field()
  associationName: string // tên tổ chức

  @Field()
  date: Date

  @Field()
  description: String
}
