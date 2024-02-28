import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
@InputType()
export class CreateMedicalStaffInput {
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

  @Field(() => [EPermission])
  permissions: EPermission[];

  @Field(() => [String], { nullable: true })
  specialtyId?: [String];
}

registerEnumType(EGender, {
  name: 'EGender',
});
