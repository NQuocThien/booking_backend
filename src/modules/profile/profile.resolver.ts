import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UsersService } from '../users/users.service';
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private userService: UsersService
  ) { }

  @Mutation(() => Profile)
  createProfile(@Args('createProfileInput') createProfileInput: CreateProfileInput) {
    return this.profileService.create(createProfileInput);
  }

  @Query(() => [Profile], { name: 'getAllProfile' })
  findAllProfile() {
    return this.profileService.getAllProfile();
  }

  @ResolveField()
  async user(@Parent() profile: Profile) {
    return await this.userService.findAll()
  }

  @Mutation(() => Profile)
  updateProfile(@Args('updateProfileInput') updateProfileInput: UpdateProfileInput) {
    return this.profileService.update(updateProfileInput.id, updateProfileInput);
  }

  @Mutation(() => Profile)
  removeProfile(@Args('id', { type: () => Int }) id: number) {
    return this.profileService.remove(id);
  }
}
