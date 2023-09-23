import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
// import { User } from './schema/user.schema';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';
import { log } from 'console';
import { UpdateUserInput } from './dto/update-user.input';
// import { Profile } from '../profile/entities/profile.entity';
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService
  ) { }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JWtAuthGuard)
  async findAll(@Context() context): Promise<User[]> {

    // console.log('test: ', context)
    return await this.usersService.findAll();
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    // log('update user: ', updateUserInput)
    return this.usersService.updateUserById(updateUserInput)
  }

  @Mutation(() => User, { name: 'deleteUser' })
  async deleteUser(@Args('id') id: string): Promise<User> {
    // log('update user: ', updateUserInput)
    return this.usersService.deleteUserById(id)
  }

  @Query(() => User, { name: 'getUser' })
  // @UseGuards(JWtAuthGuard)
  async findOne(@Args('username') username: string) {
    // console.log('test 1: ', (await this.usersService.findOne(username)))
    return await this.usersService.findOne(username);
  }

  @ResolveField(() => Profile)
  async profile(@Parent() user: User) {
    // console.log('test 2: ', user.id)
    return await this.profileService.findOneByUserId(user.id);
  }

  // @Mutation()
  // async updateUser()
}
