import { Module } from '@nestjs/common';
import { MedicalSpecialtiesResolver } from './medical-specialties.resolver';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalSpecialties,
  MedicalSpecialtiesSchema,
} from './schemas/medical-specialties.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalSpecialties.name,
        schema: MedicalSpecialtiesSchema,
      },
    ]),
  ],
  providers: [MedicalSpecialtiesResolver, MedicalSpecialtiesService],
  exports: [MedicalSpecialtiesService],
})
export class MedicalSpecialtiesModule {}
