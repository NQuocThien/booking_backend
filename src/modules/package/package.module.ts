import { Module } from '@nestjs/common';
import { PackageResolver } from './package.resolver';
import { PackageService } from './package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Package } from './entities/package.entity';
import { PackageSchema } from './schema/package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Package.name,
        schema: PackageSchema,
      },
    ]),
  ],
  providers: [PackageResolver, PackageService],
  exports: [PackageService],
})
export class PackageModule {}
