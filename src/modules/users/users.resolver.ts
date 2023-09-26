import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent, GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/roles.guard';
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService
  ) { }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Context() context): Promise<User[]> {
    // console.log('context', context)
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

  @Query(() => User, { name: 'checklogin' })
  @UseGuards(JWtAuthGuard)
  async checkLogin(@Context('req') req) {
    // console.log('test', req.user)
    return this.usersService.findOne(req?.user?.username)
  }

  @ResolveField(() => Profile)
  async profile(@Parent() user: User) {
    // console.log('test 2: ', user.id)
    return await this.profileService.findOneByUserId(user.id);
  }

  // @Mutation()
  // async updateUser()
}
