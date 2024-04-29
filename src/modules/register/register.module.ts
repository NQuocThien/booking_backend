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
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { MailModule } from '../mail/mail.module';
import { CustomerModule } from '../customer/customer.module';
import { NotificationModule } from '../notification/notification.module';

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
    forwardRef(() => MedicalStaffModule),
    forwardRef(() => CustomerModule),
    MedicalFacilitiesModule,
    NotificationModule,
    MailModule,
  ],
  providers: [RegisterResolver, RegisterService, RegisterLoaderService, PubSub],
  exports: [RegisterService, RegisterLoaderService],
})
export class RegisterModule {}
