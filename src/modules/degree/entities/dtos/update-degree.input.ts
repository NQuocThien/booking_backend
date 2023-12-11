import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class UpdateDegreeInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  abbreviations: string;
}
