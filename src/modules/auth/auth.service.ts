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
import { DoctorsService } from '../doctors/doctors.service';
import { CreateDoctorAndUserInput } from './dto/create-doctor-and-user.input';
import { CreateDoctorInput } from '../doctors/entities/dtos/create-doctor.input';
import { UpdateUserAndDoctorInput } from './dto/update-doctor-and-user.input';
import { UpdateDoctorInput } from '../doctors/entities/dtos/update-doctor.input';
import { CreatUserAndStaffInput } from './dto/create-staff-and-user.input';
import { MedicalStaff } from '../medical-staff/entities/medical-staff.entity';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { CreateMedicalStaffInput } from '../medical-staff/entities/dto/create-medical-staff.input';
import { UpdateMedicalStaffInput } from '../medical-staff/entities/dto/update-medical-staff.input';
import { UpdateUserAndStaffInput } from './dto/update-staff-and-user.input';
import { Doctor } from '../doctors/entities/doctor.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private cusSv: CustomerService,
    private docSrv: DoctorsService,
    private staffSrv: MedicalStaffService,
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
  async signupAndCreateDoctor(input: CreateDoctorAndUserInput) {
    const user = await this.userService.findOne(input.username);
    if (user) throw new Error(`User already exists ! `);

    const password = await bcrypt.hash(input.password, 10);
    const roles: Role[] = [Role.Doctor];
    const userCreated = await this.userService.createByAdmin({
      username: input.username,
      active: true,
      email: input.email,
      password: password,
      roles: roles,
    });
    if (userCreated) {
      const inputCreateDoctor: CreateDoctorInput = {
        userId: userCreated.id,
        academicTitle: input.academicTitle,
        degree: input.degree,
        doctorName: input.doctorName,
        email: input.email,
        gender: input.gender,
        numberPhone: input.numberPhone,
        price: input.price,
        specialistId: input.specialistId,
        workSchedule: input.workSchedule,
        avatar: input.avatar,
        discription: input.discription,
        medicalFactilitiesId: input.medicalFactilitiesId,
      };
      const doctor = this.docSrv.create(inputCreateDoctor);
      return doctor;
    }
  }
  async updateUserAndDoctor(input: UpdateUserAndDoctorInput) {
    const user = await this.userService.findOneById(input.userId);
    if (input.password) {
      if (!user) throw new Error(`User no exists ! `);

      const password = await bcrypt.hash(input.password, 10);
      const userUpdated = await this.userService.updateUser({
        id: user.id,
        email: input.email,
        password: password,
        active: true,
        avatar: user.avatar,
      });
      if (userUpdated) {
        const inputCreateDoctor: UpdateDoctorInput = {
          id: input.id,
          userId: userUpdated.id,
          academicTitle: input.academicTitle,
          degree: input.degree,
          doctorName: input.doctorName,
          email: input.email,
          gender: input.gender,
          numberPhone: input.numberPhone,
          price: input.price,
          specialistId: input.specialistId,
          workSchedule: input.workSchedule,
          avatar: input.avatar,
          discription: input.discription,
          medicalFactilitiesId: input.medicalFactilitiesId,
        };
        const doctor = this.docSrv.updateById(inputCreateDoctor);
        return doctor;
      }
    } else {
      const inputCreateDoctor: UpdateDoctorInput = {
        id: input.id,
        academicTitle: input.academicTitle,
        degree: input.degree,
        doctorName: input.doctorName,
        email: input.email,
        gender: input.gender,
        numberPhone: input.numberPhone,
        price: input.price,
        specialistId: input.specialistId,
        workSchedule: input.workSchedule,
        avatar: input.avatar,
        discription: input.discription,
        medicalFactilitiesId: input.medicalFactilitiesId,
      };
      const doctor = this.docSrv.updateById(inputCreateDoctor);
      return doctor;
    }
  }
  async deleteUserAndDoctor(doctorId: string): Promise<Doctor> {
    const doc = await this.docSrv.delete(doctorId);
    if (doc) {
      // console.log('doctor deleted successfully');
      this.userService.deleteUserById(doc.userId);
    }
    return doc;
  }
  // ----------------------------------------------------------------STAFF ----
  async signupAndCreateStaff(
    input: CreatUserAndStaffInput,
  ): Promise<MedicalStaff> {
    const user = await this.userService.findOne(input.username);
    if (user) throw new Error(`User already exists ! `);

    const password = await bcrypt.hash(input.password, 10);
    const roles: Role[] = [Role.Staff];
    const userCreated = await this.userService.createByAdmin({
      username: input.username,
      active: true,
      email: input.email,
      password: password,
      roles: roles,
    });
    if (userCreated) {
      const inputCreateStaff: CreateMedicalStaffInput = {
        userId: userCreated.id,
        email: input.email,
        gender: input.gender,
        medicalFacilityId: input.medicalFacilityId,
        numberPhone: input.numberPhone,
        permissions: input.permissions,
        staffName: input.staffName,
        specialtyId: input.specialtyId,
      };
      const staff = await this.staffSrv.createMedicalStaff(inputCreateStaff);
      return staff;
    }
  }
  async updateUserAndStaff(
    input: UpdateUserAndStaffInput,
  ): Promise<MedicalStaff> {
    const user = await this.userService.findOneById(input.userId);
    if (!user) throw new Error(`User no exists ! `);

    if (input.password) {
      const password = await bcrypt.hash(input.password, 10);
      const userUpdated = await this.userService.updateUser({
        id: user.id,
        email: input.email,
        password: password,
        active: true,
        avatar: user.avatar,
      });
    }
    // if (userUpdated) {
    const inputUpdateStaff: UpdateMedicalStaffInput = {
      id: input.id,
      // userId: userUpdated.id,
      email: input.email,
      gender: input.gender,
      numberPhone: input.numberPhone,
      medicalFacilityId: input.medicalFacilityId,
      permissions: input.permissions,
      staffName: input.staffName,
      specialtyId: input.specialtyId,
    };
    const staff = this.staffSrv.updateMedicalStaff(inputUpdateStaff);
    return staff;
    // }
  }
  async logout() {
    var reponse: LogoutUser = new LogoutUser();
    reponse.logout = true;
    return reponse;
  }
}
