import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
  GqlExecutionContext,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { NotFoundException, UseGuards } from '@nestjs/common';
// import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import * as bcrypt from 'bcrypt';
import { UpdateUserWithPassInput } from './dto/update-user-pass.input';
import { promises as fsPromises } from 'fs';
import { LinkImage } from './dto/image';
import deleteImage from 'src/utils/delete_image';
import { Http2ServerRequest } from 'http2';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerService } from '../customer/customer.service';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { Doctor } from '../doctors/entities/docter.entity';
import { UpdateRolesInput } from './dto/update-roles.input ';
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly customerService: CustomerService, // private readonly profileService: ProfileService,
    private readonly medicalService: MedicalFacilitiesService,
    private readonly doctorService: DoctorsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Context() context): Promise<[User]> {
    // console.log('request: ',context.req);
    const users = await this.usersService.findAll();
    return users;
  }

  @Query(() => [User], { name: 'getUserMedicalNon' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserMedicalNon(@Context() context): Promise<User[]> {
    const users = await this.usersService.getUserMedicalNon();
    const usersclinic = users.filter((user) =>
      user.roles.includes(Role.Clinic),
    );
    console.log('res ============ ', usersclinic);
    return usersclinic;
  }

  @UseGuards(JWtAuthGuard)
  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      const currentUser = await this.usersService.findOne(
        updateUserInput.username,
      );
      if (
        updateUserInput.linkImage.filename !== currentUser.linkImage.filename &&
        currentUser
      )
        deleteImage(currentUser.linkImage);
    } catch (e) {
      console.log('Error Delete Image');
    }
    return this.usersService.updateUserById(updateUserInput);
  }

  @UseGuards(JWtAuthGuard)
  @Mutation(() => User, { name: 'updateUserWithPass' })
  async updateUserWithPass(
    @Args('updateUserInput') updateUserInput: UpdateUserWithPassInput,
  ): Promise<User> {
    console.log(' updating user');
    const user = await this.usersService.findOne(updateUserInput.username);
    const valid = await bcrypt.compare(updateUserInput.password, user.password);
    console.log(
      '---> Update user ' +
        updateUserInput.username +
        ' with old password:' +
        updateUserInput.password +
        ' -> new pass: ' +
        updateUserInput.passwordNew +
        ' -> validate pass:',
      valid,
    );
    if (valid) {
      try {
        const currentUser = await this.findOne(updateUserInput.username);
        if (
          updateUserInput.linkImage.filename !==
            currentUser.linkImage.filename &&
          currentUser
        ) {
          deleteImage(currentUser.linkImage);
        }
      } catch (e) {
        console.error('Error Delete: ', e);
      }
      const password = await bcrypt.hash(updateUserInput.passwordNew, 10);
      const dataUserUpdate = { ...updateUserInput, password };
      return this.usersService.updateUserById(dataUserUpdate);
    } else {
      throw new Error('Password Error');
    }
  }

  @Mutation(() => User, { name: 'deleteUser' })
  async deleteUser(@Args('id') id: string): Promise<User> {
    // log('update user: ', updateUserInput)
    return this.usersService.deleteUserById(id);
  }

  @Mutation(() => User, { name: 'updateRoles' })
  async updateRoles(
    @Args('updateRolesInput') req: UpdateRolesInput,
  ): Promise<User> {
    // log('update user: ', updateUserInput)
    return this.usersService.updateRoles(req.id, req.roles);
  }
  @Mutation(() => User, { name: 'activeUser' })
  async activeUser(@Args('id') id: string): Promise<User> {
    // log('update user: ', updateUserInput)
    return this.usersService.activeUserById(id);
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
    const user = await this.usersService.findOne(req?.user?.username);
    // console.log('test login: ', user)
    return user;
  }

  @ResolveField(() => Customer)
  async customer(@Parent() user: User) {
    // console.log('test 2: ', user.id)SS
    return await this.customerService.findCustomerById(user.id);
  }
  @ResolveField(() => [MedicalFacilities])
  async medicalFacilities(@Parent() user: User) {
    // console.log('test 2: ', user.id)SS
    return await this.medicalService.findMedicalFacilitiesByUserId(user.id);
  }
  @ResolveField(() => [Doctor])
  async doctor(@Parent() user: User) {
    // console.log('test 2: ', user.id)SS
    return await this.doctorService.findOneByUserId(user.id);
  }
}
