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
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { FacilitiesLoaderService } from './facility-loader';
import { CustomerModule } from '../customer/customer.module';
import { ProfileService } from '../profile/profile.service';
import { ProfileModule } from '../profile/profile.module';
import { NotificationModule } from '../notification/notification.module';

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
    forwardRef(() => ProfileModule),
    forwardRef(() => CustomerModule),
    NotificationModule,
    // forwardRef(() => CustomerModule),
  ],
  providers: [
    MedicalFacilitiesResolver,
    MedicalFacilitiesService,
    FacilitiesLoaderService,
  ],
  exports: [MedicalFacilitiesService, FacilitiesLoaderService],
})
export class MedicalFacilitiesModule {}
