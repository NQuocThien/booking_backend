import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EStateRegister, ETypeOfService } from 'src/contain';
import { Session } from 'src/modules/contains/session/session.entitty';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import { MedicalSpecialties } from 'src/modules/medical-specialties/entities/medical-specialties.entity';
import { Package } from 'src/modules/package/entities/package.entity';
import { Profile } from 'src/modules/profile/entity/profile.entity';
import { Vaccination } from 'src/modules/vaccination/entities/Vaccination.entity';

// Đăng ký enum với GraphQL
registerEnumType(EStateRegister, {
  name: 'EStateRegister',
});
registerEnumType(ETypeOfService, {
  name: 'ETypeOfService',
});
@ObjectType()
export class Register {
  @Field(() => ID)
  id: String;

  @Field()
  profileId: string;

  @Field({ nullable: true })
  specialtyId?: string;

  @Field({ nullable: true })
  doctorId?: string;

  @Field({ nullable: true })
  packageId?: string;

  @Field({ nullable: true })
  vaccineId?: string;

  @Field(() => Session)
  session: Session;

  @Field()
  cancel: boolean;

  @Field(() => String)
  typeOfService: ETypeOfService;

  @Field()
  date: Date;

  @Field(() => String)
  state: EStateRegister;

  @Field()
  createdAt: Date;

  @Field(() => Profile, { nullable: true })
  profile: Profile;

  @Field(() => Doctor, { nullable: true })
  doctor: Doctor;

  @Field(() => Package, { nullable: true })
  package: Package;

  @Field(() => Vaccination, { nullable: true })
  vaccination: Vaccination;

  @Field(() => MedicalSpecialties, { nullable: true })
  specialty: MedicalSpecialties;
}
