import { Module, forwardRef } from '@nestjs/common';
import { CarePackageService } from './care-package.service';
import { CarePackageResolver } from './care-package.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CarePackage, CarePackageSchema } from './schema/care-pakage.schema';
import { RegisterModule } from '../register/register.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CarePackage.name,
        schema: CarePackageSchema,
      },
    ]),
    forwardRef(() => RegisterModule),
  ],
  providers: [CarePackageService, CarePackageResolver],
  exports: [CarePackageService],
})
export class CarePackageModule {}
