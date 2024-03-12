import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Package } from './entities/package.entity';
import { CreatePackageInput } from './entities/dto/create-package.input';
import { UpdatePackageInput } from './entities/dto/update-package.input';
import { PackageService } from './package.service';
import deleteImage from 'src/utils/delete_image';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';

@Resolver(() => Package)
export class PackageResolver {
  constructor(
    private readonly packageService: PackageService,
    private readonly facilitySvr: MedicalFacilitiesService,
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
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true }) userId: string,
  ): Promise<Package[]> {
    {
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
    }
  }

  @Query(() => Number, { name: 'getTotalPackagesCount' })
  async getTotalPackagesCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
  ): Promise<number> {
    if (userId === '') {
      const count = await this.packageService.getTotalPackagesCount(
        search || '',
      );
      return count;
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
}
