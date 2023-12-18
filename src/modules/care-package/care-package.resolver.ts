import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { CarePackageService } from './care-package.service';
import { CarePackage } from './entities/care-package.entity';
import { createCarePackageInput } from './entities/dto/create-care-package.input';
import { Register } from '../register/entities/register.entity';
import { RegisterService } from '../register/register.service';
import { UpdateCarePackageInput } from './entities/dto/update-care-package.input';

@Resolver(() => CarePackage)
export class CarePackageResolver {
  constructor(
    private readonly careService: CarePackageService,
    private readonly registeredService: RegisterService,
  ) {}
  @Query(() => [CarePackage], { name: 'getCarePackagesByClinicId' })
  async getCarePackagesByClinicId(
    @Args('id') clinicId: String,
  ): Promise<CarePackage[]> {
    return this.careService.findByClinicId(clinicId);
  }

  @Mutation(() => CarePackage, { name: 'createCarePackage' })
  async createCarePackage(
    @Args('input') input: createCarePackageInput,
  ): Promise<CarePackage> {
    console.log('test -------- Imgae: ', input);
    return this.careService.create(input);
  }
  @Mutation(() => CarePackage, { name: 'updateCarePackage' })
  async update(
    @Args('input') input: UpdateCarePackageInput,
  ): Promise<CarePackage> {
    return this.careService.update(input);
  }
  @Mutation(() => CarePackage, { name: 'deleteCarePackage' })
  async delete(@Args('input') id: String): Promise<CarePackage> {
    return this.careService.delete(id);
  }
  @ResolveField(() => [Register], { name: 'register' })
  async register(@Parent() care: CarePackage): Promise<Register[]> {
    return this.registeredService.getRegisterByPackageId(care.id);
  }
}
