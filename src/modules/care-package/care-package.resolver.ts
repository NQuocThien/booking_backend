import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CarePackageService } from './care-package.service';
import { CarePackage } from './entities/care-package.entity';
import { createCarePackageInput } from './entities/dto/create-care-package.input';
import { Register } from '../register/entities/register.entity';
import { RegisterService } from '../register/register.service';

@Resolver(() => CarePackage)
export class CarePackageResolver {
  constructor(
    private readonly careService: CarePackageService,
    private readonly registeredService: RegisterService,
  ) {}
  @Mutation(() => CarePackage, { name: 'createCarePackage' })
  async createCarePackage(
    @Args('input') input: createCarePackageInput,
  ): Promise<CarePackage> {
    return;
  }
  @ResolveField(() => [Register], { name: 'register' })
  async register(@Parent() care: CarePackage): Promise<Register[]> {
    return this.registeredService.getRegisterByPackageId(care.id);
  }
}
