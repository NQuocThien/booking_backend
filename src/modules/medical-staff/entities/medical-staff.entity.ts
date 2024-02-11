import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { EGender } from 'src/contain';
@ObjectType()
export class MedicalStaff {
  @Field(() => ID)
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
