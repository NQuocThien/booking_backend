import { InputType, Field } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
@InputType()
export class UpdateUserAndStaffInput {
  @Field()
  id: string;

  @Field()
  password: string;

  @Field()
  userId: string;

  @Field()
  medicalFacilityId: string;

  @Field()
  staffName: string;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: string;

  @Field(() => [EPermission])
  permissions: EPermission[];

  @Field(() => [String], { nullable: true })
  specialtyId?: [String];
}
// registerEnumType(EStatusService, {
//   name: 'EStatusService',
// });
