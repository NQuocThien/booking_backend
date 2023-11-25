import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginRespone } from './dto/login-respone';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGruard } from './gql-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { groupEnd, log } from 'console';
import { LogoutUser } from './dto/logout-user';
import { UpdateUserInput } from './dto/update-user.input';
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation(() => LoginRespone)
  @UseGuards(GqlAuthGruard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    // console.group('context resolcer')
    console.log('login: ', context.user);
    // console.groupEnd()
    return this.authService.login(context.user);
  }

  // @Mutation(returns => User)
  // @UseGuards(GqlAuthGruard)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput, @Context() context){
  //     log('input: ', updateUserInput )
  //     log(context.user)
  //     return context.user;
  // }

  @Mutation(() => User)
  signup(@Args('createUserInput') LoginUserInput: CreateUserInput) {
    return this.authService.signup(LoginUserInput);
  }

  @Mutation(() => LogoutUser)
  async logout(@Context() context) {
    context.user = null;
    return this.authService.logout();
  }
}
