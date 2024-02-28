import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
@InputType()
export class UpdateMedicalStaffInput {
  @Field()
  id: String;

  @Field()
  userId: String;

  @Field()
  medicalFacilityId: String;

  @Field(() => EGender)
  name: String;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field(() => [String], { nullable: true })
  specialtyId?: [String];

  @Field(() => [String], { nullable: true })
  packageId?: [String];

  @Field(() => [String], { nullable: true })
  vaccinationId?: [String];

  @Field(() => [EPermission])
  permissions: EPermission[];
}

registerEnumType(EGender, {
  name: 'EGender',
});
