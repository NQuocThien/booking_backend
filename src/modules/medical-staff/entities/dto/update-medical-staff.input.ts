import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@InputType()
export class UpdateMedicalStaffInput {
  @Field()
  id: String;

  @Field()
  userId: String;

  @Field()
  medicalFacilityId: String;

  @Field()
  name: String;

  @Field()
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;
}

registerEnumType(EGender, {
  name: 'EGender',
});
