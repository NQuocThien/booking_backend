import { Module, forwardRef } from '@nestjs/common';
import { RegisterResolver } from './register.resolver';
import { RegisterService } from './register.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Register, RegisterSchema } from './schema/register.schema';
import { CarePackage } from '../care-package/entities/care-package.entity';
import { CarePackageModule } from '../care-package/care-package.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Register.name,
        schema: RegisterSchema,
      },
    ]),
    forwardRef(() => CarePackageModule),
  ],
  providers: [RegisterResolver, RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
