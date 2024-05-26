import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Exception {
  @Field(() => [Date])
  dates: Date[];

  @Field()
  open: Boolean;

  @Field({ nullable: true })
  numbeSlot: number;
}
