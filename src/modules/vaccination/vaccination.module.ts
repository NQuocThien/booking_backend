import { Module } from '@nestjs/common';
import { VaccinationResolver } from './vaccination.resolver';
import { VaccinationService } from './vaccination.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationSchema } from './schema/vaccination.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vaccination.name,
        schema: VaccinationSchema,
      },
    ]),
  ],
  providers: [VaccinationResolver, VaccinationService],
  // exports: [VaccinationService],
})
export class VaccinationModule {}
