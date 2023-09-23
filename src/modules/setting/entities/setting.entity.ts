import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Setting {
  @Field()
  defaultLang: String
}
