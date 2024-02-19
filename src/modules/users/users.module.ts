import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { CustomerModule } from '../customer/customer.module';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { DoctorsModule } from '../doctors/doctors.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    // forwardRef(() => ProfileModule)
    // ProfileModule
    CustomerModule,
    MedicalFacilitiesModule,
    DoctorsModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
