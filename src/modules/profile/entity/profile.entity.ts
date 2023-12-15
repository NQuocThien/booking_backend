import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: String;

  @Field()
  customerId: string;

  @Field()
  fullname: string;

  @Field()
  gender: string;

  @Field()
  address: string;

  @Field()
  numberPhone: string;

  @Field()
  email: string;

  @Field()
  dataOfBirth: Date;

  @Field({ nullable: true })
  identity: string;

  @Field()
  ethnic: string; // dân tộc

  @Field({ nullable: true })
  medicalInsurance: string; // BHYT

  @Field()
  job: string;

  @Field()
  relationship: string; // mqh
}
