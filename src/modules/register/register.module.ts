import { Module, forwardRef } from '@nestjs/common';
import { RegisterResolver } from './register.resolver';
import { RegisterService } from './register.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Register, RegisterSchema } from './schema/register.schema';
import { ProfileModule } from '../profile/profile.module';
import { PubSub } from 'graphql-subscriptions';
import { DoctorsModule } from '../doctors/doctors.module';
import { PackageModule } from '../package/package.module';
import { MedicalSpecialtiesModule } from '../medical-specialties/medical-specialties.module';
import { VaccinationModule } from '../vaccination/vaccination.module';
import { RegisterLoaderService } from './register-loader.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Register.name,
        schema: RegisterSchema,
      },
    ]),
    forwardRef(() => ProfileModule),
    forwardRef(() => DoctorsModule),
    forwardRef(() => PackageModule),
    forwardRef(() => MedicalSpecialtiesModule),
    forwardRef(() => VaccinationModule),
  ],
  providers: [RegisterResolver, RegisterService, RegisterLoaderService, PubSub],
  exports: [RegisterService, RegisterLoaderService],
})
export class RegisterModule {}
