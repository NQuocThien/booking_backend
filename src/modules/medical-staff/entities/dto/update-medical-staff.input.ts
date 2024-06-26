import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
@InputType()
export class UpdateMedicalStaffInput {
  @Field()
  id: String;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  medicalFacilityId: String;

  @Field(() => String)
  staffName: String;

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
