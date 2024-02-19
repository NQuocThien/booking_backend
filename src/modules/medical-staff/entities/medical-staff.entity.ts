import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
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

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field(() => [String])
  permissions: EPermission[];
}
registerEnumType(EGender, {
  name: 'EGender',
});
