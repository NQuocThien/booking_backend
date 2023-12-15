import { Module, forwardRef } from '@nestjs/common';
import { MedicalFacilitiesResolver } from './medical-facilities.resolver';
import { MedicalFacilitiesService } from './medical-facilities.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalFacilities,
  MedicalFacilitiesSchema,
} from './schema/medical-facilities.schema';
import { DoctorsModule } from '../doctors/doctors.module';
import { CarePackageModule } from '../care-package/care-package.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalFacilities.name,
        schema: MedicalFacilitiesSchema,
      },
    ]),
    DoctorsModule,
    forwardRef(() => CarePackageModule),
  ],
  providers: [MedicalFacilitiesResolver, MedicalFacilitiesService],
  exports: [MedicalFacilitiesService],
})
export class MedicalFacilitiesModule {}
