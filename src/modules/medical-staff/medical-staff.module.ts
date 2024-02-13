import { Module } from '@nestjs/common';
import { MedicalStaffResolver } from './medical-staff.resolver';
import { MedicalStaffService } from './medical-staff.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalStaff } from './entities/medical-staff.entity';
import { MedicalStaffSchema } from './schema/medical-staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MedicalStaff.name,
        schema: MedicalStaffSchema,
      },
    ]),
  ],
  providers: [MedicalStaffResolver, MedicalStaffService],
  exports: [MedicalStaffService],
})
export class MedicalStaffModule {}