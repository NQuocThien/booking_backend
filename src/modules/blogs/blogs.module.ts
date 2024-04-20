import { Module } from '@nestjs/common';
import { BlogsResolver } from './blogs.resolver';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schema/blog.schema';
import { Blog } from './entities/blog.entity';
import { UsersModule } from '../users/users.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
    UsersModule,
    DoctorsModule,
    MedicalStaffModule,
    MedicalFacilitiesModule,
  ],
  providers: [BlogsResolver, BlogsService],
})
export class BlogsModule {}
