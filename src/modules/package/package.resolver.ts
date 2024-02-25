import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Package } from './entities/package.entity';
import { CreatePackageInput } from './entities/dto/create-package.input';
import { UpdatePackageInput } from './entities/dto/update-package.input';
import { PackageService } from './package.service';
import deleteImage from 'src/utils/delete_image';

@Resolver(() => Package)
export class PackageResolver {
  constructor(private readonly packageService: PackageService) {}

  @Query(() => [Package], { name: 'getAllPackage' })
  async getAllPackage(): Promise<Package[]> {
    return await this.packageService.findAll();
  }

  @Query(() => Package, { name: 'getPackageById' })
  async getPackageById(@Args('input') input: String): Promise<Package> {
    return await this.packageService.findById(input);
  }

  @Mutation(() => Package, { name: 'createPackage' })
  async createPackage(
    @Args('input') input: CreatePackageInput,
  ): Promise<Package> {
    // console.log('createPackage');
    return await this.packageService.create(input);
  }

  @Mutation(() => Package, { name: 'updatePackage' })
  async updatePackage(
    @Args('input') input: UpdatePackageInput,
  ): Promise<Package> {
    const currDocs = await this.packageService.findById(input.id);
    try {
      if (JSON.stringify(currDocs) !== JSON.stringify(input.image))
        deleteImage(currDocs.image);
    } catch (e) {
      console.error(e.message);
    }
    return await this.packageService.update(input);
  }

  @Mutation(() => Package, { name: 'deletePackage' })
  async deletePackage(@Args('input') input: String): Promise<Package> {
    const currDocs = await this.packageService.findById(input);
    try {
      deleteImage(currDocs.image);
    } catch (e) {
      console.error(e.message);
    }
    return await this.packageService.delete(input);
  }
}
