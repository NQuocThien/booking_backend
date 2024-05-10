import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
@InputType()
export class CreatUserAndStaffInput {
  @Field()
  username: string;

  @Field()
  password: string;

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
