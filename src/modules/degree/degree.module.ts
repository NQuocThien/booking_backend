import { Module, forwardRef } from '@nestjs/common';
import { DegreeResolver } from './degree.resolver';
import { DegreeService } from './degree.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Degree, DegreeSchema } from './schemas/degree.schema';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Degree.name,
        schema: DegreeSchema,
      },
    ]),
    forwardRef(() => DoctorsModule),
  ],
  providers: [DegreeResolver, DegreeService],
  exports: [DegreeService],
})
export class DegreeModule {}
