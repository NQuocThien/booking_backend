import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { LogoutUser } from './dto/logout-user';
import { CustomerService } from '../customer/customer.service';
import { CreateUserByAdminInput } from './dto/create-user-by-admin.input';
import { Role } from './entities/role.enum';
import { ErrorMes } from './entities/mess.enum';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private cusSv: CustomerService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new Error(ErrorMes.UserNotFound); // Nếu không tìm thấy người dùng, throw lỗi
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(ErrorMes.InvalidPassword); // Nếu mật khẩu không hợp lệ, throw lỗi
    }
    if (!user.active) {
      throw new Error(ErrorMes.UserIsInactive); // Nếu tài khoản không hoạt động, throw lỗi
    }
    var result: User = new User();
    result = user;
    result.password = '';
    return result;
  }
  async login(user: User) {
    // console.log('user login', user)
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        roles: user.roles,
      }),
      user,
    };
  }
  async signup(loginUserInput: CreateUserInput) {
    const user = await this.userService.findOne(loginUserInput.username);
    if (user)
      throw new Error(`User ${loginUserInput.username} already exists ! `);
    const password = await bcrypt.hash(loginUserInput.password, 10);
    const roles: Role[] = [Role.Customer];

    return this.userService.create({
      username: loginUserInput.username,
      active: true,
      email: loginUserInput.email,
      password: password,
      roles: roles,
    });
  }
  async signupUser(loginUserInput: CreateUserByAdminInput) {
    const user = await this.userService.findOne(loginUserInput.username);
    if (user) throw new Error(`User already exists ! `);
    const password = await bcrypt.hash(loginUserInput.password, 10);
    const roles: Role[] = [];
    return this.userService.createByAdmin({
      username: loginUserInput.username,
      active: true,
      email: loginUserInput.email,
      password: password,
      roles: roles,
    });
  }
  async logout() {
    var reponse: LogoutUser = new LogoutUser();
    reponse.logout = true;
    return reponse;
  }
}
