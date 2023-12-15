import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTypePackageInput {
  @Field()
  typeName: String;
}
