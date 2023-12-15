import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TypePackageService } from './type-package.service';
import { CarePackageService } from '../care-package/care-package.service';
import { TypePackage } from './entities/type-packed';
import { CreateTypePackageInput } from './entities/dto/create-type-package.input';
import { CarePackage } from '../care-package/entities/care-package.entity';
import { UpdateTypePackageInput } from './entities/dto/update-type-package.input';

@Resolver(() => TypePackage)
export class TypePackageResolver {
  constructor(
    private readonly typeService: TypePackageService,
    private readonly careService: CarePackageService,
  ) {}

  @Mutation(() => TypePackage, { name: 'createTypePackage' })
  async createTypePackage(
    @Args('input') input: CreateTypePackageInput,
  ): Promise<TypePackage> {
    return await this.typeService.create(input);
  }
  @Mutation(() => TypePackage, { name: 'updateTypePackage' })
  async updateTypePackage(
    @Args('input') input: UpdateTypePackageInput,
  ): Promise<TypePackage> {
    return await this.typeService.update(input);
  }
  @Mutation(() => TypePackage, { name: 'deleteTypePackage' })
  async deleteTypePackage(@Args('id') id: String): Promise<TypePackage> {
    return await this.typeService.delete(id);
  }

  @ResolveField(() => [CarePackage], { name: 'carePackage' })
  async carePackage(
    @Parent() typePackage: TypePackage,
  ): Promise<CarePackage[]> {
    return this.careService.findOneByTypeId(typePackage.id);
  }
}
