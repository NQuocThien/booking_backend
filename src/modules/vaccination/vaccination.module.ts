import { Module, forwardRef } from '@nestjs/common';
import { VaccinationResolver } from './vaccination.resolver';
import { VaccinationService } from './vaccination.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationSchema } from './schema/vaccination.schema';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { VaccinationLoaderService } from './vaccination-loader.service';
import { RegisterModule } from '../register/register.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vaccination.name,
        schema: VaccinationSchema,
      },
    ]),
    forwardRef(() => MedicalFacilitiesModule),
    forwardRef(() => RegisterModule),
    MedicalStaffModule,
  ],
  providers: [
    VaccinationResolver,
    VaccinationService,
    VaccinationLoaderService,
  ],
  exports: [VaccinationService, VaccinationLoaderService],
})
export class VaccinationModule {}
