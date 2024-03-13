import { Module, forwardRef } from '@nestjs/common';
import { MedicalStaffResolver } from './medical-staff.resolver';
import { MedicalStaffService } from './medical-staff.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalStaff } from './entities/medical-staff.entity';
import { MedicalStaffSchema } from './schema/medical-staff.schema';
import { MedicalSpecialtiesModule } from '../medical-specialties/medical-specialties.module';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalStaff.name,
        schema: MedicalStaffSchema,
      },
    ]),
    forwardRef(() => MedicalFacilitiesModule),
    forwardRef(() => MedicalSpecialtiesModule),
  ],
  providers: [MedicalStaffResolver, MedicalStaffService],
  exports: [MedicalStaffService],
})
export class MedicalStaffModule {}
