import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { CustomerService } from '../customer/customer.service';
import { Profile } from './entity/profile.entity';
import { CreateProfileInput } from './entity/dtos/create-profile.input';
import { UpdateProfileInput } from './entity/dtos/update-profile.input';
import { RegisterService } from '../register/register.service';
import { Register } from '../register/entities/register.entity';
import { Customer } from '../customer/entities/customer.entity';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly regisService: RegisterService,
    private readonly customerSvr: CustomerService,
  ) {}

  @Mutation(() => Profile, { name: 'createProfile' })
  async create(@Args('input') input: CreateProfileInput): Promise<Profile> {
    return this.profileService.create(input);
  }

  @Mutation(() => Profile, { name: 'updateProfile' })
  async update(@Args('input') input: UpdateProfileInput): Promise<Profile> {
    return this.profileService.update(input);
  }

  @Mutation(() => Profile, { name: 'deleteProfile' })
  async delete(@Args('id') id: String): Promise<Profile> {
    return this.profileService.delete(id);
  }
  @Query(() => [Profile], { name: 'getProfileByCustomerId' })
  async getProfileByCustomerId(@Args('id') id: string): Promise<Profile[]> {
    const result = await this.profileService.getProfileByCustomerId(id);
    return result;
  }
  @Query(() => [Profile], { name: 'getAllProfile' })
  async getAllProfile(): Promise<Profile[]> {
    const result = await this.profileService.findAll();
    return result;
  }
  @ResolveField(() => [Register], { name: 'register' })
  async register(@Parent() profile: Profile): Promise<Register[]> {
    return this.regisService.getRegisterByProfileId(profile.id);
  }
  @ResolveField(() => Customer, { name: 'customer' })
  async customer(@Parent() profile: Profile): Promise<Customer | null> {
    if (profile.customerId) {
      const customer = await this.customerSvr.findById(profile.customerId);
      return customer || null;
    }
    return null;
  }
}
