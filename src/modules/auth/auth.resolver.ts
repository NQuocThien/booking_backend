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
import { CreateDoctorAndUserInput } from './dto/create-doctor-and-user.input';
import { JWtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { Role } from './entities/role.enum';
import { Doctor } from '../doctors/entities/doctor.entity';
import { FacilitiesLoaderService } from '../medical-facilities/facility-loader';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { EPermission } from 'src/contain';
import { UsersService } from '../users/users.service';
import { UpdateUserAndDoctorInput } from './dto/update-doctor-and-user.input';
import { CreatUserAndStaffInput } from './dto/create-staff-and-user.input';
import { MedicalStaff } from '../medical-staff/entities/medical-staff.entity';
import { UpdateUserAndStaffInput } from './dto/update-staff-and-user.input';
@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private readonly facilityLoaderSrv: FacilitiesLoaderService,
    private readonly staffSrv: MedicalStaffService,
    private readonly userSrv: UsersService,
  ) {}
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
  //---------------------------------------------------------------
  @UseGuards(JWtAuthGuard)
  @Roles(Role.Facility, Role.Staff)
  @Mutation(() => Doctor, { name: 'signupAndCreateDoctor' })
  async signupAndCreateDoctor(
    @Args('input') input: CreateDoctorAndUserInput,
    @Context() context,
  ): Promise<Doctor> {
    const username = context.req.user.username;
    const currentUser = await this.userSrv.findOne(username);
    const facility = await this.facilityLoaderSrv.load(
      input.medicalFactilitiesId,
    );
    if (facility)
      if (facility.userId === currentUser.id)
        return this.authService.signupAndCreateDoctor(input);
      else if (currentUser.roles.includes(Role.Staff)) {
        const staff = await this.staffSrv.findByUserId(currentUser.id);
        if (
          staff.medicalFacilityId === facility.id &&
          staff.permissions.includes(EPermission.Magager)
        ) {
          return this.authService.signupAndCreateDoctor(input);
        }
      }
  }
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  @UseGuards(JWtAuthGuard)
  @Roles(Role.Facility, Role.Staff)
  @Mutation(() => Doctor, { name: 'updateUserAndDoctor' })
  async updateUserAndDoctor(
    @Args('input') input: UpdateUserAndDoctorInput,
    @Context() context,
  ): Promise<Doctor> {
    const username = context.req.user.username;
    const currentUser = await this.userSrv.findOne(username);
    const facility = await this.facilityLoaderSrv.load(
      input.medicalFactilitiesId,
    );
    if (facility)
      if (facility.userId === currentUser.id)
        return this.authService.updateUserAndDoctor(input);
      else if (currentUser.roles.includes(Role.Staff)) {
        const staff = await this.staffSrv.findByUserId(currentUser.id);
        if (
          staff.medicalFacilityId === facility.id &&
          staff.permissions.includes(EPermission.Magager)
        ) {
          return this.authService.updateUserAndDoctor(input);
        }
      }
  }
  // ----------------------------------------------------------------
  @UseGuards(JWtAuthGuard)
  @Roles(Role.Facility, Role.Staff)
  @Mutation(() => Doctor, { name: 'deleteUserAndDoctor' })
  async deleteUserAndDoctor(
    @Args('doctorId') doctorId: string,
    @Args('medicalFactilitiesId') medicalFactilitiesId: string,
    @Context() context,
  ): Promise<Doctor> {
    const username = context.req.user.username;
    const currentUser = await this.userSrv.findOne(username);
    const facility = await this.facilityLoaderSrv.load(medicalFactilitiesId);
    if (facility)
      if (facility.userId === currentUser.id)
        return this.authService.deleteUserAndDoctor(doctorId);
      else if (currentUser.roles.includes(Role.Staff)) {
        const staff = await this.staffSrv.findByUserId(currentUser.id);
        if (
          staff.medicalFacilityId === facility.id &&
          staff.permissions.includes(EPermission.Magager)
        ) {
          return this.authService.deleteUserAndDoctor(doctorId);
        }
      }
  }
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  @UseGuards(JWtAuthGuard)
  @Roles(Role.Facility, Role.Staff)
  @Mutation(() => MedicalStaff, { name: 'createUserAndStaff' })
  async createUserAndStaff(
    @Args('input') input: CreatUserAndStaffInput,
    @Context() context,
  ): Promise<MedicalStaff> {
    const username = context.req.user.username;
    const currentUser = await this.userSrv.findOne(username);
    const facility = await this.facilityLoaderSrv.load(input.medicalFacilityId);
    if (facility)
      if (facility.userId === currentUser.id)
        return this.authService.signupAndCreateStaff(input);
      else if (currentUser.roles.includes(Role.Staff)) {
        const staff = await this.staffSrv.findByUserId(currentUser.id);
        if (
          staff.medicalFacilityId === facility.id &&
          staff.permissions.includes(EPermission.Magager)
        ) {
          return this.authService.signupAndCreateStaff(input);
        }
      }
  }
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  @UseGuards(JWtAuthGuard)
  @Roles(Role.Facility, Role.Staff)
  @Mutation(() => MedicalStaff, { name: 'updateUserAndStaff' })
  async updateUserAndStaff(
    @Args('input') input: UpdateUserAndStaffInput,
    @Context() context,
  ): Promise<MedicalStaff> {
    const username = context.req.user.username;
    const currentUser = await this.userSrv.findOne(username);
    const facility = await this.facilityLoaderSrv.load(input.medicalFacilityId);
    if (facility)
      if (facility.userId === currentUser.id)
        return this.authService.updateUserAndStaff(input);
      else if (currentUser.roles.includes(Role.Staff)) {
        const staff = await this.staffSrv.findByUserId(currentUser.id);
        if (
          staff.medicalFacilityId === facility.id &&
          staff.permissions.includes(EPermission.Magager)
        ) {
          return this.authService.updateUserAndStaff(input);
        }
      }
  }
  //---------------------------------------------------------------
  @Mutation(() => LogoutUser)
  async logout(@Context() context) {
    context.user = null;
    return this.authService.logout();
  }
}
