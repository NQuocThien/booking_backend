import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateDegreeInput {
  @Field()
  name: string;

  @Field()
  abbreviations: string;
}
