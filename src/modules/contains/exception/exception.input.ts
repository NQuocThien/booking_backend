import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ExceptionInput {
  @Field(() => [Date])
  dates: Date[];

  @Field()
  open: Boolean;

  @Field({ nullable: true })
  numbeSlot: Number;
}
