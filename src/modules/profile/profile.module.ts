import { Module, forwardRef } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { CustomerModule } from '../customer/customer.module';
import { RegisterModule } from '../register/register.module';
import { ProfileLoaderService } from './profile-loader.service';
import { NotificationModule } from '../notification/notification.module';

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
    NotificationModule,
  ],
  providers: [ProfileResolver, ProfileService, ProfileLoaderService],
  exports: [ProfileService],
})
export class ProfileModule {}
