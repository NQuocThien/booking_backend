import { Module, forwardRef } from '@nestjs/common';
import { MedicalFacilitiesResolver } from './medical-facilities.resolver';
import { MedicalFacilitiesService } from './medical-facilities.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalFacilities,
  MedicalFacilitiesSchema,
} from './schema/medical-facilities.schema';
import { DoctorsModule } from '../doctors/doctors.module';
import { PackageModule } from '../package/package.module';
import { VaccinationModule } from '../vaccination/vaccination.module';
import { MedicalSpecialtiesModule } from '../medical-specialties/medical-specialties.module';
import { MedicalStaff } from '../medical-staff/entities/medical-staff.entity';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { FacilitiesLoaderService } from './facility-loader';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalFacilities.name,
        schema: MedicalFacilitiesSchema,
      },
    ]),
    forwardRef(() => DoctorsModule),
    forwardRef(() => PackageModule),
    forwardRef(() => VaccinationModule),
    forwardRef(() => MedicalSpecialtiesModule),
    forwardRef(() => MedicalStaffModule),
  ],
  providers: [
    MedicalFacilitiesResolver,
    MedicalFacilitiesService,
    FacilitiesLoaderService,
  ],
  exports: [MedicalFacilitiesService, FacilitiesLoaderService],
})
export class MedicalFacilitiesModule {}
