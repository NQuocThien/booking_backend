import { Module, forwardRef } from '@nestjs/common';
import { TypePackageResolver } from './type-package.resolver';
import { TypePackageService } from './type-package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypePackage, TypePackageSchema } from './schemas/type-package.shema';
import { CarePackageModule } from '../care-package/care-package.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TypePackage.name,
        schema: TypePackageSchema,
      },
    ]),
    forwardRef(() => CarePackageModule),
  ],
  providers: [TypePackageResolver, TypePackageService],
  exports: [TypePackageService],
})
export class TypePackageModule {}
