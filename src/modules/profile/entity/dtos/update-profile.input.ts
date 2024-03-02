import { InputType, Field } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class UpdateProfileInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  fullname: string;

  @Field({ nullable: true })
  numberPhone: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => EGender)
  gender: EGender;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  dataOfBirth: Date;

  @Field({ nullable: true })
  identity: string;

  @Field({ nullable: true })
  ethnic: string; // dân tộc

  @Field({ nullable: true })
  medicalInsurance: string; // BHYT

  @Field({ nullable: true })
  job: string;

  @Field({ nullable: true })
  relationship: string;
}
