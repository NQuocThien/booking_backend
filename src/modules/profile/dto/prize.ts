import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PrizeInput {
  @Field()
  name: string

  @Field()
  associationName: string // tên tổ chức

  @Field()
  date: Date

  @Field()
  description: String
}
