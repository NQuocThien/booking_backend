import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginRespone } from './dto/login-respone';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGruard } from './gql-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input'
@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService){
    }
    @Mutation(() => LoginRespone )
    @UseGuards(GqlAuthGruard)
    login(@Args('loginUserInput') LoginUserInput:LoginUserInput, @Context() context){
        return this.authService.login(context.user)
    }

    @Mutation(() => User)
    signup(@Args('createUserInput') LoginUserInput:CreateUserInput){
        return this.authService.signup(LoginUserInput)
    }
}
