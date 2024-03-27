import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Package } from './entities/package.entity';
import { CreatePackageInput } from './entities/dto/create-package.input';
import { UpdatePackageInput } from './entities/dto/update-package.input';
import { PackageService } from './package.service';
import deleteImage from 'src/utils/delete_image';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { EPermission } from 'src/contain';
import { UnauthorizedException } from '@nestjs/common';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';

@Resolver(() => Package)
export class PackageResolver {
  constructor(
    private readonly packageService: PackageService,
    private readonly facilitySvr: MedicalFacilitiesService,
    private readonly staffSvr: MedicalStaffService,
  ) {}

  @Query(() => [Package], { name: 'getAllPackage' })
  async getAllPackage(): Promise<Package[]> {
    return await this.packageService.findAll();
  }

  @Query(() => Package, { name: 'getPackageById' })
  async getPackageById(@Args('input') input: String): Promise<Package> {
    return await this.packageService.findById(input);
  }

  @Query(() => [Package], { name: 'getAllPackageByFacilityId' })
  async getAllPackageByFacilityId(
    @Args('input') input: String,
  ): Promise<Package[]> {
    return await this.packageService.findByMedicalFacilityId(input);
  }

  @Query(() => [Package], { name: 'getAllPackageSelect' })
  async getAllPackageSelect(@Args('input') input: String): Promise<Package[]> {
    return await this.packageService.findByMedicalFacilityId(input);
  }

  @Mutation(() => Package, { name: 'createPackage' })
  async createPackage(
    @Args('input') input: CreatePackageInput,
  ): Promise<Package> {
    return await this.packageService.create(input);
  }

  @Mutation(() => Package, { name: 'updatePackage' })
  async updatePackage(
    @Args('input') input: UpdatePackageInput,
  ): Promise<Package> {
    const currDocs = await this.packageService.findById(input.id);
    const compare: boolean =
      JSON.stringify(currDocs.image) !== JSON.stringify(input.image);
    console.log('---> Delete image: ', compare);
    if (compare) {
      deleteImage(currDocs.image, 'packages');
    }

    return await this.packageService.update(input);
  }

  @Query(() => [Package], { name: 'getAllPackagePaginationOfFacility' })
  // @UseGuards(JWtAuthGuard)
  async getAllPackagePaginationOfFacility(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'packageName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<Package[]> {
    {
      if (userId !== '') {
        const facility = await this.facilitySvr.findOneByUserId(userId);
        if (facility) {
          const docs =
            await this.packageService.getAllPackagePaginationOfFacility(
              search,
              page,
              limit,
              sortField,
              sortOrder,
              facility.id,
            );
          return docs;
        } else return null;
      } else {
        if (staffId !== '') {
          const staff = await this.staffSvr.findById(staffId);
          if (staff) {
            const docs =
              await this.packageService.getAllPackagePaginationOfFacility(
                search,
                page,
                limit,
                sortField,
                sortOrder,
                staff.medicalFacilityId,
              );
            return docs;
          } else return null;
        } else return null;
      }
    }
  }

  @Query(() => [Package], { name: 'getAllPackagePaginationByStaff' })
  // @UseGuards(JWtAuthGuard)
  async getAllPackagePaginationByStaff(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'packageName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('staffId', { nullable: true }) staffId: string,
  ): Promise<Package[]> {
    {
      const staff = await this.staffSvr.findById(staffId);
      // nếu nhân viên là maanger hoặc có quyền quản lý gói khám thì trả tổng số gói
      if (
        (staff && staff.permissions.includes(EPermission.MagagerPackage)) ||
        staff.permissions.includes(EPermission.Magager)
      ) {
        const docs =
          await this.packageService.getAllPackagePaginationOfFacility(
            search,
            page,
            limit,
            sortField,
            sortOrder,
            staff.medicalFacilityId,
          );
        return docs;
      } else throw new UnauthorizedException();
    }
  }

  @Query(() => Number, { name: 'getTotalPackagesCount' })
  async getTotalPackagesCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId?: string,
  ): Promise<number> {
    if (userId === '') {
      if (staffId !== '') {
        const staff = await this.staffSvr.findById(staffId);
        if (staff && staff.permissions.includes(EPermission.MagagerPackage)) {
          const count =
            await this.packageService.getTotalPackagesCountOfFacility(
              search || '',
              staff.medicalFacilityId,
            );
          return count;
        } else throw new UnauthorizedException();
      } else {
        const count = await this.packageService.getTotalPackagesCount(
          search || '',
        );
        return count;
      }
    } else {
      const facility = await this.facilitySvr.findOneByUserId(userId);
      if (facility) {
        const count = await this.packageService.getTotalPackagesCountOfFacility(
          search || '',
          facility.id,
        );
        return count;
      }
      return null;
    }
  }

  @Mutation(() => Package, { name: 'deletePackage' })
  async deletePackage(@Args('input') input: string): Promise<Package> {
    const currDocs = await this.packageService.findById(input);
    try {
      deleteImage(currDocs.image, 'packages');
    } catch (e) {
      console.error(e.message);
    }
    return await this.packageService.delete(input);
  }

  @ResolveField(() => MedicalFacilities, { name: 'facility' })
  async facility(@Parent() p: Package): Promise<MedicalFacilities> {
    return this.facilitySvr.findById(p.medicalFactilitiesId);
  }
}
