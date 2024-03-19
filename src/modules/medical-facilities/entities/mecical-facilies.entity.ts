import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EStatusService, ETypeOfFacility } from 'src/contain';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import { MedicalSpecialties } from 'src/modules/medical-specialties/entities/medical-specialties.entity';
import { MedicalStaff } from 'src/modules/medical-staff/entities/medical-staff.entity';
import { Package } from 'src/modules/package/entities/package.entity';
import { LinkImage } from 'src/modules/users/dto/image';
import { Vaccination } from 'src/modules/vaccination/entities/Vaccination.entity';
@ObjectType()
export class MedicalFacilities {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  medicalFacilityName: string;

  @Field()
  address: string;

  @Field()
  numberPhone?: string;

  @Field()
  logo: LinkImage;

  @Field()
  image: LinkImage;

  @Field()
  email: string;

  @Field({ nullable: true })
  lat: number;

  @Field({ nullable: true })
  lng: number;

  @Field()
  discription: string;

  @Field()
  introduce: string;

  @Field(() => String)
  typeOfFacility: ETypeOfFacility;

  @Field()
  operatingStatus: string; // trạng thái hoạt động

  @Field()
  legalRepresentation: string; // đại diện pháp luật

  @Field()
  taxCode: string; // mã số thuế

  @Field(() => String)
  status: EStatusService;

  @Field(() => [Date], { nullable: true })
  dateOff: [Date];

  @Field()
  schedule: string;

  @Field(() => [Doctor], { nullable: true })
  doctors: Doctor[];

  @Field(() => [Package], { nullable: true })
  packages: Package[];

  @Field(() => [MedicalSpecialties], { nullable: true })
  medicalSpecialties: MedicalSpecialties[];

  @Field(() => [Vaccination], { nullable: true })
  vaccinations: Vaccination[];

  @Field(() => [MedicalStaff], { nullable: true })
  medicalStaffs: MedicalStaff[];

  @Field(() => Number, { nullable: true })
  totalDoctors: number;

  @Field(() => Number, { nullable: true })
  totalSpecialties: number;

  @Field(() => Number, { nullable: true })
  totalVaccinations: number;

  @Field(() => Number, { nullable: true })
  totalPackages: number;
}
