import { Module, forwardRef } from '@nestjs/common';
import { DoctorsResolver } from './doctors.resolver';
import { DoctorsService } from './doctors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor } from './entities/docter.entity';
import { DoctorSchema } from './schema/docter.schema';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { MedicalSpecialtiesModule } from '../medical-specialties/medical-specialties.module';
import { DegreeModule } from '../degree/degree.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Doctor.name,
        schema: DoctorSchema,
      },
    ]),
    MedicalSpecialtiesModule,
    forwardRef(() => DegreeModule),
  ],
  providers: [DoctorsResolver, DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
