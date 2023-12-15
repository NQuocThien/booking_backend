import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { CustomerService } from '../customer/customer.service';
import { Profile } from './entity/profile.entity';
import { CreateProfileInput } from './entity/dtos/create-profile.input';

@Resolver()
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly customerService: CustomerService,
  ) {}

  @Mutation(() => Profile, { name: 'createProfile' })
  async create(@Args('input') input: CreateProfileInput): Promise<Profile> {
    return this.profileService.create(input);
  }
  @Query(() => [Profile], { name: 'getProfileByCustomerId' })
  async getProfileByCustomerId(@Args('id') id: String): Promise<Profile[]> {
    return this.profileService.getProfileByCustomerId(id);
  }
}
