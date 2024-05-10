import { Module, forwardRef } from '@nestjs/common';
import { DoctorsResolver } from './doctors.resolver';
import { DoctorsService } from './doctors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor } from './entities/doctor.entity';
import { DoctorSchema } from './schema/doctor.schema';
import { MedicalSpecialtiesModule } from '../medical-specialties/medical-specialties.module';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { DoctorLoaderService } from './doctor-loader.service';
import { RegisterModule } from '../register/register.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Doctor.name,
        schema: DoctorSchema,
      },
    ]),
    MedicalSpecialtiesModule,
    forwardRef(() => MedicalFacilitiesModule),
    forwardRef(() => RegisterModule),
    MedicalStaffModule,
    // forwardRef(() => AuthModule),
  ],
  providers: [DoctorsResolver, DoctorsService, DoctorLoaderService],
  exports: [DoctorsService, DoctorLoaderService],
})
export class DoctorsModule {}
