import { Module, forwardRef } from '@nestjs/common';
import { RegisterResolver } from './register.resolver';
import { RegisterService } from './register.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Register, RegisterSchema } from './schema/register.schema';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Register.name,
        schema: RegisterSchema,
      },
    ]),
    forwardRef(() => ProfileModule),
  ],
  providers: [RegisterResolver, RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
