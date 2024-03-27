import { Module, forwardRef } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { CustomerModule } from '../customer/customer.module';
import { Register } from '../register/entities/register.entity';
import { RegisterModule } from '../register/register.module';
import { ProfileLoaderService } from './profile-loader.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
    forwardRef(() => CustomerModule),
    forwardRef(() => RegisterModule),
  ],
  providers: [ProfileResolver, ProfileService, ProfileLoaderService],
  exports: [ProfileService],
})
export class ProfileModule {}
