import { Module, forwardRef } from '@nestjs/common';
import { MedicalSpecialtiesResolver } from './medical-specialties.resolver';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicalSpecialties,
  MedicalSpecialtiesSchema,
} from './schemas/medical-specialties.schema';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { MedicalSpecialtiesLoaderService } from './medical-specialties-loader.service';
import { RegisterModule } from '../register/register.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalSpecialties.name,
        schema: MedicalSpecialtiesSchema,
      },
    ]),
    forwardRef(() => MedicalFacilitiesModule),
    forwardRef(() => MedicalStaffModule),
    forwardRef(() => RegisterModule),
  ],
  providers: [
    MedicalSpecialtiesResolver,
    MedicalSpecialtiesService,
    MedicalSpecialtiesLoaderService,
  ],
  exports: [MedicalSpecialtiesService, MedicalSpecialtiesLoaderService],
})
export class MedicalSpecialtiesModule {}
