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
import { Profile } from '../profile/entity/profile.entity';
import { ProfileService } from '../profile/profile.service';
import { UpdateRegisterInput } from './entities/dtos/update-register.input';

@Resolver(() => Register)
export class RegisterResolver {
  constructor(
    private readonly regisService: RegisterService,
    private readonly packageService: CarePackageService,
    private readonly profileService: ProfileService,
  ) {}

  @Mutation(() => Register, { name: 'createRegister' })
  async createRegister(
    @Args('input') input: CreateRegisterInput,
  ): Promise<Register> {
    return await this.regisService.create(input);
  }
  @Mutation(() => Register, { name: 'updateRegister' })
  async updateRegister(
    @Args('input') input: UpdateRegisterInput,
  ): Promise<Register> {
    console.log('update input', input);
    return await this.regisService.update(input);
  }
  @ResolveField(() => CarePackage, { name: 'carePackage' })
  async carePackage(@Parent() regis: Register): Promise<CarePackage> {
    return this.packageService.finById(regis.packegeId);
  }
  @ResolveField(() => Profile, { name: 'profile' })
  async profile(@Parent() regis: Register): Promise<Profile> {
    return this.profileService.findById(regis.profileId);
  }
}
