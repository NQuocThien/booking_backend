import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginRespone } from './dto/login-respone';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGruard } from './gql-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LogoutUser } from './dto/logout-user';
import { CreateUserByAdminInput } from './dto/create-user-by-admin.input';
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation(() => LoginRespone)
  @UseGuards(GqlAuthGruard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    console.log('---> Login: ', context.user.username);
    return this.authService.login(context.user);
  }

  @Mutation(() => User)
  signup(@Args('createUserInput') LoginUserInput: CreateUserInput) {
    return this.authService.signup(LoginUserInput);
  }

  @Mutation(() => User, { name: 'signupUser' })
  signupUser(@Args('createUserInput') LoginUserInput: CreateUserByAdminInput) {
    return this.authService.signupUser(LoginUserInput);
  }

  @Mutation(() => LogoutUser)
  async logout(@Context() context) {
    context.user = null;
    return this.authService.logout();
  }
}
