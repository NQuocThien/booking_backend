import { Module, forwardRef } from '@nestjs/common';
import { VaccinationResolver } from './vaccination.resolver';
import { VaccinationService } from './vaccination.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationSchema } from './schema/vaccination.schema';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vaccination.name,
        schema: VaccinationSchema,
      },
    ]),
    forwardRef(() => MedicalFacilitiesModule),
  ],
  providers: [VaccinationResolver, VaccinationService],
  exports: [VaccinationService],
})
export class VaccinationModule {}
