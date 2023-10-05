import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { LogoutUser } from './dto/logout-user';
@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        console.log('---> password input: ', password)
        const valid = await bcrypt.compare(password, user.password);
        if (user && valid) {
            var result: User = new User()
            result = user
            result.password = ""
            return result;
        }
        return null;
    }
    async login(user: User) {
        // console.log('user login', user)
        return {
            access_token: this.jwtService.sign({
                username: user.username,
                roles: user.roles,
            }),
            user
        }
    }
    async signup(loginUserInput: CreateUserInput) {
        const user = await this.userService.findOne(loginUserInput.username)
        if (user)
            throw new Error(`User ${loginUserInput.username} already exists ! `);
        const password = await bcrypt.hash(loginUserInput.password, 10)
        return this.userService.create(
            {
                ...loginUserInput,
                password,
                type: +process.env.INIT_TYPE,
                profile: null
            }
        )
    }
    async logout() {
        var reponse: LogoutUser = new LogoutUser();
        reponse.logout = true
        return reponse
    }
}
