import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { EGender, EPermission } from 'src/contain';
import { MedicalSpecialties } from 'src/modules/medical-specialties/entities/medical-specialties.entity';
@ObjectType()
export class MedicalStaff {
  @Field(() => ID)
  id: string;

  @Field()
  userId: String;

  @Field()
  medicalFacilityId: string;

  @Field()
  staffName: string;

  @Field(() => String)
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field(() => [String])
  permissions: EPermission[];

  @Field(() => [String], { nullable: true })
  specialtyId?: [String];

  @Field(() => [MedicalSpecialties], { nullable: true })
  specialties?: [MedicalSpecialties];
}
registerEnumType(EGender, {
  name: 'EGender',
});
