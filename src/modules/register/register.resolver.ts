import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RegisterService } from './register.service';
import { Register } from './entities/register.entity';
import { ProfileService } from '../profile/profile.service';
import { UpdateRegisterInput } from './entities/dtos/update-register.input';
import { CreateRegisterDoctorInput } from './entities/dtos/create-register-doctor.input';
import { CreateRegisterSpecialtyInput } from './entities/dtos/create-register-specialty.input';
import { CreateRegisterPackageInput } from './entities/dtos/create-register-package.Input';
import { CreateRegisterVaccineInput } from './entities/dtos/create-register-vaccine.input';
import { Profile } from '../profile/entity/profile.entity';
import { GetRegisterByOptionInput } from './entities/dtos/get-register-option.input';
import { ConfirmRegisterInput } from './entities/dtos/confirm-register.input';

@Resolver(() => Register)
export class RegisterResolver {
  constructor(
    private readonly regisService: RegisterService,
    private readonly profileSvr: ProfileService,
  ) {}

  @Mutation(() => Register, { name: 'createRegisterDoctor' })
  async createRegisterDoctor(
    @Args('input') input: CreateRegisterDoctorInput,
  ): Promise<Register> {
    return await this.regisService.createRegisterDoctor(input);
  }

  @Query(() => [Register], { name: 'getAllRegisterByOption' })
  async getAllRegisterByOption(
    @Args('input') input: GetRegisterByOptionInput,
  ): Promise<Register[]> {
    return await this.regisService.getAllRegisterByOption(input);
  }

  @Mutation(() => Register, { name: 'createRegisterSpecialty' })
  async createRegisterSpecialty(
    @Args('input') input: CreateRegisterSpecialtyInput,
  ): Promise<Register> {
    return await this.regisService.createRegisterSpecialty(input);
  }

  @Mutation(() => Register, { name: 'createRegisterPackage' })
  async createRegisterPackage(
    @Args('input') input: CreateRegisterPackageInput,
  ): Promise<Register> {
    return await this.regisService.createRegisterPackage(input);
  }

  @Mutation(() => Register, { name: 'createRegisterVaccine' })
  async createRegisterVaccine(
    @Args('input') input: CreateRegisterVaccineInput,
  ): Promise<Register> {
    return await this.regisService.createRegisterVaccine(input);
  }

  @Mutation(() => Register, { name: 'updateRegister' })
  async updateRegister(
    @Args('input') input: UpdateRegisterInput,
  ): Promise<Register> {
    return await this.regisService.update(input);
  }

  @Mutation(() => Register, { name: 'confirmRegister' })
  async confirmRegister(
    @Args('input') input: ConfirmRegisterInput,
  ): Promise<Register> {
    return await this.regisService.confirmRegister(input);
  }

  @ResolveField(() => Profile, { name: 'profile' })
  async profile(@Parent() regis: Register): Promise<Profile> {
    return this.profileSvr.findById(regis.profileId);
  }
}
