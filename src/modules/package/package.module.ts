import { Module, forwardRef } from '@nestjs/common';
import { PackageResolver } from './package.resolver';
import { PackageService } from './package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Package } from './entities/package.entity';
import { PackageSchema } from './schema/package.schema';
import { MedicalFacilitiesModule } from '../medical-facilities/medical-facilities.module';
import { MedicalStaffModule } from '../medical-staff/medical-staff.module';
import { PackageLoaderService } from './package-loader.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Package.name,
        schema: PackageSchema,
      },
    ]),
    forwardRef(() => MedicalFacilitiesModule),
    MedicalStaffModule,
  ],
  providers: [PackageResolver, PackageService, PackageLoaderService],
  exports: [PackageService, PackageLoaderService],
})
export class PackageModule {}
