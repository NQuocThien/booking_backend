import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RegisterService } from './register.service';
import { Register } from './entities/register.entity';
import { CreateRegisterInput } from './entities/dtos/create-register';
import { CarePackage } from '../care-package/entities/care-package.entity';
import { CarePackageService } from '../care-package/care-package.service';

@Resolver(() => Register)
export class RegisterResolver {
  constructor(
    private readonly regisService: RegisterService,
    private readonly packageService: CarePackageService,
  ) {}

  @Mutation(() => Register, { name: 'createRegister' })
  async createRegister(
    @Args('input') input: CreateRegisterInput,
  ): Promise<Register> {
    return await this.regisService.create(input);
  }
  @ResolveField(() => CarePackage, { name: 'carePackage' })
  async carePackage(@Parent() regis: Register): Promise<CarePackage> {
    return this.packageService.finById(regis.packegeId);
  }
}
