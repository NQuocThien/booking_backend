import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
// import { User } from './schema/user.schema';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(()=> [User], {name: 'users'})
  @UseGuards(JWtAuthGuard)
  async findAll(@Context() context): Promise<User[]> { 
    // console.log('test')
    return await this.usersService.findAll();
  }

  @Query(()=> User, {name: 'user'})
  @UseGuards(JWtAuthGuard)
  findOne(@Args('username') username: string) {
    return this.usersService.findOne(username);
  } 
}
