import { Module } from '@nestjs/common';
import { MedicalFacilitiesResolver } from './medical-facilities.resolver';
import { MedicalFacilitiesService } from './medical-facilities.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalFacilities,
  MedicalFacilitiesSchema,
} from './schema/medical-facilities.schema';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalFacilities.name,
        schema: MedicalFacilitiesSchema,
      },
    ]),
    DoctorsModule,
  ],
  providers: [MedicalFacilitiesResolver, MedicalFacilitiesService],
  exports: [MedicalFacilitiesService],
})
export class MedicalFacilitiesModule {}
