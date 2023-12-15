import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTypePackageInput {
  @Field()
  id: String;

  @Field()
  typeName: String;
}
