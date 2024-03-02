import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import * as bcrypt from 'bcrypt';
import { UpdateUserWithPassInput } from './dto/update-user-pass.input';
import deleteImage from 'src/utils/delete_image';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerService } from '../customer/customer.service';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { UpdateRolesInput } from './dto/update-roles.input ';
import { UserSelectInput } from './dto/role-select.input';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly customerService: CustomerService, // private readonly profileService: ProfileService,
    private readonly medicalService: MedicalFacilitiesService,
    private readonly doctorService: DoctorsService,
    private readonly medicalStaff: MedicalStaffService,
  ) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(@Context() context): Promise<[User]> {
    console.log('--> request: get all user');
    const users = await this.usersService.findAll();
    return users;
  }

  @Query(() => [User], { name: 'getUserMedicalNon' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserMedicalNon(@Context() context): Promise<User[]> {
    const users = await this.usersService.findAll();
    const usersClinic = users.filter((user) =>
      user.roles.includes(Role.Clinic),
    );
    return usersClinic;
  }

  @Query(() => [User], { name: 'getUserDoctorPending' })
  // @UseGuards(JWtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  async getUserDoctorPending(@Context() context): Promise<User[]> {
    const users = await this.usersService.findAll();
    const doctors = await this.doctorService.findAll();
    const userPending = users.filter(
      (user) => !doctors.find((doctor) => doctor.userId === user.id),
    );
    const userDoctorPending = userPending.filter((user) =>
      user.roles.includes(Role.Doctor),
    );
    return userDoctorPending;
  }
  @Query(() => [User], { name: 'getUserDoctorPendingUpdate' })
  async getUserDoctorPendingUpdate(
    @Context() context,
    @Args('input') idDoctor: String,
  ): Promise<User[]> {
    const users = await this.usersService.findAll();
    const doctors = await this.doctorService.findAll();
    const userPending = users.filter(
      (user) =>
        !doctors.find(
          (doctor) => doctor.id !== idDoctor && doctor.userId === user.id,
        ),
    );
    const userDoctorPending = userPending.filter((user) =>
      user.roles.includes(Role.Doctor),
    );
    return userDoctorPending;
  }

  @Query(() => [User], { name: 'getUserSelect' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserSelect(
    @Args('roleInput') input: UserSelectInput,
  ): Promise<User[]> {
    const users = await this.usersService.findAll();
    const userFillter = users.filter((user) => user.roles.includes(input.role));
    return userFillter;
  }
  @Query(() => [User], { name: 'getUserStaffSelect' })
  async getUserStaffSelect(@Args('input') idStaff: String): Promise<User[]> {
    const users = await this.usersService.findAll();
    const staffs = await this.medicalStaff.getAllMedicalStaff();
    const userPending = users.filter(
      (user) =>
        !staffs.find((st) => st.id !== idStaff && st.userId === user.id),
    );
    const userStaffPending = userPending.filter((user) =>
      user.roles.includes(Role.Staff),
    );
    return userStaffPending;
  }

  @Query(() => User, { name: 'getUserSelected' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserSelected(@Args('id') input: String): Promise<User> {
    const user = await this.usersService.findOneById(input);
    return user;
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
    return await this.usersService.findOne(username);
  }

  @Query(() => User, { name: 'checklogin' })
  @UseGuards(JWtAuthGuard)
  async checkLogin(@Context('req') req) {
    const user = await this.usersService.findOne(req?.user?.username);
    return user;
  }

  @Query(() => Number, { name: 'totalUsersCount' })
  async getTotalUsersCount(
    @Args('search', { nullable: true }) search?: string,
  ): Promise<number> {
    const count = await this.usersService.getTotalUsersCount(search || '');
    return count;
  }

  @Query(() => [User], { name: 'getAllUsersPagination' })
  // @UseGuards(JWtAuthGuard)
  async getAllUsersPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'username' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
  ): Promise<User[]> {
    {
      const user = await this.usersService.getAllUsersPagination(
        search,
        page,
        limit,
        sortField,
        sortOrder,
      );
      return user;
    }
  }

  @ResolveField(() => Customer)
  async customer(@Parent() user: User) {
    return await this.customerService.findByUserId(user.id);
  }
  @ResolveField(() => [MedicalFacilities])
  async medicalFacilities(@Parent() user: User) {
    return await this.medicalService.findMedicalFacilitiesByUserId(user.id);
  }
  @ResolveField(() => [Doctor])
  async doctor(@Parent() user: User) {
    return await this.doctorService.findOneByUserId(user.id);
  }
}
