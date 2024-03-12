import { Module, forwardRef } from '@nestjs/common';
import { MedicalSpecialtiesResolver } from './medical-specialties.resolver';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalSpecialties,
  MedicalSpecialtiesSchema,
} from './schemas/medical-specialties.schema';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalSpecialties.name,
        schema: MedicalSpecialtiesSchema,
      },
    ]),
    forwardRef(() => MedicalFacilitiesModule),
  ],
  providers: [MedicalSpecialtiesResolver, MedicalSpecialtiesService],
  exports: [MedicalSpecialtiesService],
})
export class MedicalSpecialtiesModule {}
