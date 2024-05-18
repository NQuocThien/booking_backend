import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { RegisterService } from './register.service';
import { Register } from './entities/register.entity';
import { ProfileService } from '../profile/profile.service';
import { UpdateRegisterInput } from './entities/dtos/update-register.input';
import { CreateRegisterDoctorInput } from './entities/dtos/create-register-doctor.input';
import { CreateRegisterSpecialtyInput } from './entities/dtos/create-register-specialty.input';
import { CreateRegisterPackageInput } from './entities/dtos/create-register-package.Input';
import { CreateRegisterVaccineInput } from './entities/dtos/create-register-vaccine.input';
import { Profile } from '../profile/entity/profile.entity';
import { GetRegisterByOptionInput } from './entities/dtos/get-register-option.input';
import { ConfirmRegisterInput } from './entities/dtos/confirm-register.input';
import { PubSub } from 'graphql-subscriptions';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Package } from '../package/entities/package.entity';
import { Vaccination } from '../vaccination/entities/Vaccination.entity';
import { MedicalSpecialties } from '../medical-specialties/entities/medical-specialties.entity';
import { MedicalSpecialtiesLoaderService } from '../medical-specialties/medical-specialties-loader.service';
import { PackageLoaderService } from '../package/package-loader.service';
import { DoctorLoaderService } from '../doctors/doctor-loader.service';
import { VaccinationLoaderService } from '../vaccination/vaccination-loader.service';
import { RegisterLoaderService } from './register-loader.service';
import { GetRegisPendingInput } from './entities/dtos/get-regis-pending.input';
import { GetRegisHistoryInput } from './entities/dtos/get-register-history.input copy';
import { FacilitiesLoaderService } from '../medical-facilities/facility-loader';
import { StaffLoaderService } from '../medical-staff/staff-loader';
import { MailService } from '../mail/mail.service';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.entity';
import { EStateRegister, ETypeOfService } from 'src/contain';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationInput } from '../notification/entities/dtos/create-notification.input';
import { NotificationResolver } from '../notification/notification.resolver';
import { UpLoadFileRegisInput } from './entities/dtos/upload-file.input';
import { UseGuards } from '@nestjs/common';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionInput } from '../contains/session/session.input';
import { RegisPendingInput } from './entities/dtos/regis-pending.input';
const pubSub = new PubSub();
interface IServiceIds {
  doctorsIds: string[];
  packagesIds: string[];
  vaccinesIds: string[];
  specialtiesIds: string[];
}
@Resolver(() => Register)
export class RegisterResolver {
  constructor(
    private readonly regisService: RegisterService,
    private readonly registerLoader: RegisterLoaderService,
    private readonly profileSvr: ProfileService,
    private readonly specialtyLoader: MedicalSpecialtiesLoaderService,
    private readonly packageLoader: PackageLoaderService,
    private readonly doctorLoader: DoctorLoaderService,
    private readonly vaccinationLoader: VaccinationLoaderService,
    private readonly facilityLoaderSrv: FacilitiesLoaderService,
    private readonly staffLoaderSrv: StaffLoaderService,
    private readonly customerSrv: CustomerService,
    private readonly notificationSrv: NotificationService,
    private readonly notificationResolver: NotificationResolver,

    private readonly emailService: MailService,
  ) {}
  // =============================== --> QUERY <--- ==================================
  @Query(() => [Register], { name: 'getAllRegisterByOption' })
  async getAllRegisterByOption(
    @Args('input') input: GetRegisterByOptionInput,
  ): Promise<Register[]> {
    return await this.regisService.getAllRegisterByOption(input);
  }

  @Query(() => Register, { name: 'getRegisById' })
  async getRegisById(@Args('id') id: string): Promise<Register> {
    return await this.regisService.findById(id);
  }

  @Query(() => [Register], { name: 'getAllRegisPending' })
  async getAllRegisPending(
    @Args('input') input: GetRegisPendingInput,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true, defaultValue: undefined }) search: string,
  ): Promise<Register[]> {
    if (input.userId) {
      const facility = await this.facilityLoaderSrv.loadByUserId(input.userId);
      if (facility) {
        const serviceIds = await this.getServiceIds(facility.id);
        const pendingInput: RegisPendingInput = {
          ...input,
          doctorIds: serviceIds.doctorsIds,
          packageIds: serviceIds.packagesIds,
          vaccineIds: serviceIds.vaccinesIds,
          specialtyIds: serviceIds.specialtiesIds,
        };
        return await this.regisService.getAllRegisPending(
          pendingInput,
          page,
          limit,
          search,
        );
      }
    } else if (input.facilityIdFromStaff) {
      const serviceIds = await this.getServiceIds(input.facilityIdFromStaff);
      const pendingInput: RegisPendingInput = {
        ...input,
        doctorIds: serviceIds.doctorsIds,
        packageIds: serviceIds.packagesIds,
        vaccineIds: serviceIds.vaccinesIds,
        specialtyIds: serviceIds.specialtiesIds,
      };
      return await this.regisService.getAllRegisPending(
        pendingInput,
        page,
        limit,
      );
    }
    throw new Error('Không có quyền truy cập');
  }
  @Query(() => Number, { name: 'getAllRegisPendingCount' })
  async getAllRegisPendingCount(
    @Args('input') input: GetRegisPendingInput,
  ): Promise<number> {
    if (input.userId) {
      const facility = await this.facilityLoaderSrv.loadByUserId(input.userId);
      if (facility) {
        const serviceIds = await this.getServiceIds(facility.id);
        const pendingInput: RegisPendingInput = {
          ...input,
          doctorIds: serviceIds.doctorsIds,
          packageIds: serviceIds.packagesIds,
          vaccineIds: serviceIds.vaccinesIds,
          specialtyIds: serviceIds.specialtiesIds,
        };
        return await this.regisService.getAllRegisPendingCount(pendingInput);
      }
    } else if (input.facilityIdFromStaff) {
      const serviceIds = await this.getServiceIds(input.facilityIdFromStaff);
      const pendingInput: RegisPendingInput = {
        ...input,
        doctorIds: serviceIds.doctorsIds,
        packageIds: serviceIds.packagesIds,
        vaccineIds: serviceIds.vaccinesIds,
        specialtyIds: serviceIds.specialtiesIds,
      };
      return await this.regisService.getAllRegisPendingCount(pendingInput);
    }
    throw new Error('Không có quyền truy cập');
  }

  @Query(() => [Register], { name: 'getAllRegisOfService' })
  async getAllRegisOfService(
    @Args('input') input: GetRegisterByOptionInput,
  ): Promise<any> {
    return await this.regisService.getAllRegisOfService(input);
  }

  @Query(() => [Register], { name: 'getRegisHistory' })
  async getRegisHistory(
    @Args('profileId') profileId: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<Register[]> {
    if (userId !== '') {
      const facility = await this.facilityLoaderSrv.loadByUserId(userId);
      if (facility) {
        const serviceIds: IServiceIds = await this.getServiceIds(facility.id);

        const input: GetRegisHistoryInput = {
          profileId: profileId,
          doctorIds: serviceIds.doctorsIds,
          packageIds: serviceIds.packagesIds,
          specialtyIds: serviceIds.specialtiesIds,
          vaccineIds: serviceIds.vaccinesIds,
        };
        return await this.regisService.getRegisHistory(input, 'date', 'desc');
      }
    } else {
      if (staffId !== '') {
        const staff = await this.staffLoaderSrv.load(staffId);
        if (staff) {
          const serviceIds: IServiceIds = await this.getServiceIds(
            staff.medicalFacilityId,
          );

          const input: GetRegisHistoryInput = {
            profileId: profileId,
            doctorIds: serviceIds.doctorsIds,
            packageIds: serviceIds.packagesIds,
            specialtyIds: serviceIds.specialtiesIds,
            vaccineIds: serviceIds.vaccinesIds,
          };

          return await this.regisService.getRegisHistory(input, 'date', 'desc');
        }
      }
    }
    return;
  }

  @Query(() => Register, { name: 'getAllRegisCountByOption' })
  async getAllRegisCountByOption(
    @Args('input') input: GetRegisterByOptionInput,
  ): Promise<any> {
    // return await this.regisService.getAllRegisPending(input);
    return null;
  }

  // =============================== --> MUTATION <--- ==================================

  @Mutation(() => Register, { name: 'createRegisterDoctor' })
  async createRegisterDoctor(
    @Args('input') input: CreateRegisterDoctorInput,
  ): Promise<Register> {
    const doctor = await this.doctorLoader.load(input.doctorId);
    await this.checkVaildReigs(
      ETypeOfService.Doctor,
      input.profileId,
      input.doctorId,
      input.date.toDateString(),
      input.session,
      doctor.workSchedule.numberSlot,
    );
    const res = await this.regisService.createRegisterDoctor(input);
    this.createNottifyAndEmail(res);
    this.registerLoader.clean(input.profileId);
    this.emitRegisterPendingCreatedEvent(res);
    return res;
  }

  @Mutation(() => Register, { name: 'createRegisterSpecialty' })
  async createRegisterSpecialty(
    @Args('input') input: CreateRegisterSpecialtyInput,
  ): Promise<Register> {
    const specialty = await this.specialtyLoader.load(input.specialtyId);
    await this.checkVaildReigs(
      ETypeOfService.Doctor,
      input.profileId,
      input.specialtyId,
      input.date.toDateString(),
      input.session,
      specialty?.workSchedule?.numberSlot,
    );
    const regiter = await this.regisService.createRegisterSpecialty(input);
    this.createNottifyAndEmail(regiter);
    this.registerLoader.clean(input.profileId);
    this.emitRegisterPendingCreatedEvent(regiter);
    return regiter;
  }

  @Mutation(() => Register, { name: 'createRegisterPackage' })
  async createRegisterPackage(
    @Args('input') input: CreateRegisterPackageInput,
  ): Promise<Register> {
    const p = await this.packageLoader.load(input.packageId);
    await this.checkVaildReigs(
      ETypeOfService.Package,
      input.profileId,
      input.packageId,
      input.date.toDateString(),
      input.session,
      p.workSchedule.numberSlot,
    );
    const res = await this.regisService.createRegisterPackage(input);
    this.registerLoader.clean(input.profileId);
    this.emitRegisterPendingCreatedEvent(res);

    return res;
  }

  @Mutation(() => Register, { name: 'createRegisterVaccine' })
  async createRegisterVaccine(
    @Args('input') input: CreateRegisterVaccineInput,
  ): Promise<Register> {
    const vaccine = await this.vaccinationLoader.load(input.vaccineId);
    await this.checkVaildReigs(
      ETypeOfService.Doctor,
      input.profileId,
      input.vaccineId,
      input.date.toDateString(),
      input.session,
      vaccine?.workSchedule?.numberSlot,
    );
    const res = await this.regisService.createRegisterVaccine(input);
    this.createNottifyAndEmail(res);
    this.registerLoader.clean(input.profileId);
    this.emitRegisterPendingCreatedEvent(res);
    return res;
  }

  @Mutation(() => Register, { name: 'updateRegister' })
  async updateRegister(
    @Args('input') input: UpdateRegisterInput,
  ): Promise<Register> {
    return await this.regisService.update(input);
  }

  @Mutation(() => Register, { name: 'cancelRegister' })
  async cancelRegister(@Args('id') id: string): Promise<Register> {
    const res = await this.regisService.cancelRegis(id);
    this.registerLoader.clean(res.profileId);
    return res;
  }

  @Mutation(() => Register, { name: 'cancelRegisterByAdmin' })
  async cancelRegisterByAdmin(
    @Args('id') id: string,
    @Args('content') content: string,
  ): Promise<Register> {
    const res = await this.regisService.cancelRegis(id);
    this.registerLoader.clean(res.profileId);
    this.createNottifyAndEmailCancel(res, content);
    return res;
  }

  @UseGuards(JWtAuthGuard)
  @Mutation(() => Register, { name: 'uploadFileRegister' })
  async uploadFileRegister(
    @Args('input') input: UpLoadFileRegisInput,
  ): Promise<Register> {
    const res = await this.regisService.uploadFile(input);
    this.registerLoader.clean(res.profileId);
    return res;
  }

  @Mutation(() => Register, { name: 'confirmRegister' })
  async confirmRegister(
    @Args('input') input: ConfirmRegisterInput,
  ): Promise<Register> {
    // throw new Error('test error');
    var res: Register;
    await this.regisService
      .confirmRegister(input)
      .then((regis) => {
        this.callEmitRegisterCreatedEvent(regis);
        this.registerLoader.clean(regis.profileId);
        // tạo thông báo
        this.createNottifyAndEmail(regis);
        res = regis;
      })
      .catch((e) => {
        throw new Error(e);
      });
    return res;
  }

  // =============================== --> SUBSCRIPTION <--- ==================================

  @Subscription(() => Register, {
    name: 'registerCreated',
    filter: (payload, variables) => {
      function isEqualDate(a: string, b: string): boolean {
        const date1 = new Date(a);
        const date2 = new Date(b);
        if (
          date1.getDay() === date2.getDay() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        )
          return true;
        return false;
      }
      const doctorId = variables.option.doctorId;
      const packageId = variables.option.packageId;
      const specialtyId = variables.option.specialtyId;
      const vaccineId = variables.option?.vaccineId;
      const inputDate = variables.option.date;
      // --- payload ---
      const registered = payload.registerCreated;
      if (doctorId) {
        if (
          doctorId === registered.doctorId &&
          isEqualDate(inputDate, registered.date)
        ) {
          return true;
        }
        return false;
      }
      if (packageId) {
        if (
          packageId === registered.packageId &&
          isEqualDate(inputDate, registered.date)
        )
          return true;
        return false;
      }
      if (specialtyId) {
        if (
          specialtyId === registered.specialtyId &&
          isEqualDate(inputDate, registered.date)
        )
          return true;
        return false;
      }
      if (vaccineId) {
        if (
          vaccineId === registered.vaccineId &&
          isEqualDate(inputDate, registered.date)
        )
          return true;
        return false;
      }
      return true;
    },
  })
  async registerCreated(@Args('option') option: GetRegisterByOptionInput) {
    // Return an asynchronous iterator to listen for events
    return pubSub.asyncIterator('registerCreated');
  }

  private async callEmitRegisterCreatedEvent(
    register: Register,
  ): Promise<void> {
    await this.emitRegisterCreatedEvent(register);
  }

  private async emitRegisterCreatedEvent(register: Register): Promise<void> {
    await pubSub.publish('registerCreated', { registerCreated: register });
  }

  @Subscription(() => Register, {
    name: 'registerPendingCreated',
    filter: (payload, variables) => {
      const doctorIds = variables.option.doctorIds;
      const packageIds = variables.option.packageIds;
      const specialtyIds = variables.option.specialtyIds;
      const vaccineIds = variables.option?.vaccineIds;
      const startTime = new Date(variables.option.startTime);
      const endTime = new Date(variables.option.endTime);
      startTime.setHours(0, 0, 0, 0);
      endTime.setHours(23, 59, 59, 999);
      // --- payload ---
      const registered = payload.registerPendingCreated;
      if (registered.doctorId) {
        if (doctorIds.find((d) => d === registered.doctorId)) {
          if (registered.date >= startTime && registered.date <= endTime)
            return true;
        }
        return false;
      }
      if (registered.vaccineId) {
        if (vaccineIds.find((d) => d === registered.vaccineId)) {
          if (registered.date >= startTime && registered.date <= endTime)
            return true;
        }
        return false;
      }
      if (registered.specialtyId) {
        if (specialtyIds.find((d) => d === registered.specialtyId)) {
          if (registered.date >= startTime && registered.date <= endTime)
            return true;
        }
        return false;
      }
      if (registered.packageId) {
        if (packageIds.find((d) => d === registered.packageId)) {
          if (registered.date >= startTime && registered.date <= endTime)
            return true;
        }
        return false;
      }
      return false;
    },
  })
  async registerPendingCreated(@Args('option') option: RegisPendingInput) {
    return pubSub.asyncIterator('registerPendingCreated');
  }

  private async emitRegisterPendingCreatedEvent(
    register: Register,
  ): Promise<void> {
    await pubSub.publish('registerPendingCreated', {
      registerPendingCreated: register,
    });
  }

  // =============================== --> RESOLVE FIELD <--- ==================================

  @ResolveField(() => Profile, { name: 'profile' })
  async profile(@Parent() regis: Register): Promise<Profile> {
    return this.profileSvr.findById(regis.profileId);
  }

  @ResolveField(() => Doctor, { name: 'doctor' })
  async doctor(@Parent() regis: Register): Promise<Doctor> {
    if (regis?.doctorId) return this.doctorLoader.load(regis.doctorId);
    else return null;
  }

  @ResolveField(() => Package, { name: 'package' })
  async package(@Parent() regis: Register): Promise<Package> {
    if (regis?.packageId) return this.packageLoader.load(regis.packageId);
    else return null;
  }

  @ResolveField(() => Vaccination, { name: 'vaccination' })
  async vaccination(@Parent() regis: Register): Promise<Vaccination> {
    if (regis?.vaccineId) return this.vaccinationLoader.load(regis.vaccineId);
    else return null;
  }

  @ResolveField(() => MedicalSpecialties, { name: 'specialty' })
  async specialty(@Parent() regis: Register): Promise<MedicalSpecialties> {
    if (regis?.specialtyId) {
      const data = await this.specialtyLoader.load(regis.specialtyId);

      return data;
    } else return null;
  }

  isEqualDate(a: Date, b: Date): boolean {
    if (
      a.getDay() === b.getDay() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    )
      return true;
    return false;
  }
  //======================================= TOOLS =================================================

  checkSessionExist(ss1: SessionInput, ss2: SessionInput): boolean {
    const ss1Start = new Date(`1970-01-01T${ss1.startTime}`);
    const ss1End = new Date(`1970-01-01T${ss1.endTime}`);
    const ss2Start = new Date(`1970-01-01T${ss2.startTime}`);
    const ss2End = new Date(`1970-01-01T${ss2.endTime}`);
    if (
      (ss1Start < ss2Start && ss2Start < ss1End) ||
      (ss1Start < ss2End && ss2End < ss1End)
    ) {
      return true;
    }
    return false;
  }

  async checkVaildReigs(
    typeOfService: ETypeOfService,
    profileId: string,
    serviceId: string,
    date: string,
    session: SessionInput,
    maxSlot?: number,
  ) {
    const allRegisDateSession = await this.regisService.getRegisDate(date);
    const isExistProfileInSesssion = allRegisDateSession.find(
      (r) =>
        r.profileId === profileId &&
        (this.checkSessionExist(r.session, session) ||
          (r.session.startTime === session.startTime &&
            r.session.endTime === session.endTime)),
    );
    const regisProfileInDay = allRegisDateSession.filter(
      (r) => r.profileId === profileId,
    ).length;
    const isExistService = (): boolean => {
      if (typeOfService === ETypeOfService.Doctor)
        return !!allRegisDateSession.find(
          (r) => r.profileId === profileId && r.doctorId === serviceId,
        );
      if (typeOfService === ETypeOfService.Package)
        return !!allRegisDateSession.find(
          (r) => r.profileId === profileId && r.packageId === serviceId,
        );
      if (typeOfService === ETypeOfService.Specialty)
        return !!allRegisDateSession.find(
          (r) => r.profileId === profileId && r.specialtyId === serviceId,
        );
      if (typeOfService === ETypeOfService.Vaccine)
        return !!allRegisDateSession.find(
          (r) => r.profileId === profileId && r.vaccineId === serviceId,
        );
    };
    const countRegisOfSession = (): number => {
      if (typeOfService === ETypeOfService.Doctor)
        return allRegisDateSession.filter(
          (r) =>
            r.doctorId === serviceId &&
            r.session.startTime === session.startTime &&
            r.session.endTime === session.endTime,
        ).length;
      if (typeOfService === ETypeOfService.Package)
        return allRegisDateSession.filter(
          (r) =>
            r.packageId === serviceId &&
            r.session.startTime === session.startTime &&
            r.session.endTime === session.endTime,
        ).length;
      if (typeOfService === ETypeOfService.Vaccine)
        return allRegisDateSession.filter(
          (r) =>
            r.vaccineId === serviceId &&
            r.session.startTime === session.startTime &&
            r.session.endTime === session.endTime,
        ).length;
      if (typeOfService === ETypeOfService.Specialty)
        return allRegisDateSession.filter(
          (r) =>
            r.specialtyId === serviceId &&
            r.session.startTime === session.startTime &&
            r.session.endTime === session.endTime,
        ).length;
    };
    // ----------------------------------------------------------------
    if (isExistProfileInSesssion) {
      throw new Error('Phiên khám đã tồn tại'); // check
    }
    if (regisProfileInDay > 5) {
      throw new Error('Quá lượt đăng ký tối đa trong ngày'); // check
    }
    if (isExistService()) {
      throw new Error('Dịch vụ khám đã đăng ký trong ngày'); // check
    }
    if (maxSlot && countRegisOfSession() >= maxSlot) {
      throw new Error('Phiên khám đã hết lượt');
    }
  }
  async createNottifyAndEmailCancel(regis: Register, content: string) {
    const profile: Profile = await this.profileSvr.findById(regis.profileId);
    const isShare = !!regis.createdBy;
    const customer: Customer = await this.customerSrv.findById(
      profile.customerId,
    );
    var service: string;
    var facilityName: string;

    if (regis.typeOfService === ETypeOfService.Doctor) {
      const doctor = await this.doctorLoader.load(regis.doctorId);
      service = doctor.doctorName;
      facilityName = (
        await this.facilityLoaderSrv.load(doctor.medicalFactilitiesId)
      ).medicalFacilityName;
    }
    if (regis.typeOfService === ETypeOfService.Package) {
      const p = await this.packageLoader.load(regis.packageId);
      service = p.packageName;
      facilityName = (await this.facilityLoaderSrv.load(p.medicalFactilitiesId))
        .medicalFacilityName;
    }
    if (regis.typeOfService === ETypeOfService.Specialty) {
      const specialty = await this.specialtyLoader.load(regis.specialtyId);
      service = specialty.specialtyName;
      facilityName = (
        await this.facilityLoaderSrv.load(specialty.medicalFactilityId)
      ).medicalFacilityName;
    }
    if (regis.typeOfService === ETypeOfService.Vaccine) {
      const vaccine = await this.vaccinationLoader.load(regis.vaccineId);
      service = vaccine.vaccineName;
      facilityName = (
        await this.facilityLoaderSrv.load(vaccine.medicalFactilitiesId)
      ).medicalFacilityName;
    }

    var notification: CreateNotificationInput = {
      userId: '',
      detailPath: `/account/ticket`,
      content: '',
    };

    if (profile && customer) {
      notification.userId = customer.userId;
      const date: string = `${regis.date.getDate()}/${
        regis.date.getMonth() + 1
      }/${regis.date.getFullYear()}`;
      if (regis.cancel === true) {
        notification.content = `Đã hủy đăng ký của hồ sơ "${profile.fullname}" ${regis.typeOfService} "${service}" ngày "${regis.session.startTime}" ngày "${date}" bởi "${facilityName}" vì ${content}`;
        notification.detailPath = '/account/ticket';
        if (isShare)
          this.createNottifyAndEmailByCustomerKey(
            regis,
            notification.content,
            notification.detailPath,
          );
        this.emailService.sendMailCancel(
          profile.email,
          customer.fullname,
          profile.fullname,
          regis.typeOfService,
          service,
          date,
          regis.session.startTime,
          regis.session.endTime,
          content,
        );
      }
    }
    // subscription cho user
    await this.notificationSrv
      .create(notification)
      .then((res) => this.notificationResolver.emitNotifyCreatedEvent(res));
  }
  async createNottifyAndEmail(regis: Register) {
    const profile: Profile = await this.profileSvr.findById(regis.profileId);
    const customer: Customer = await this.customerSrv.findById(
      profile.customerId,
    );
    const isShare = !!regis?.createdBy;
    var service: string;
    var facilityName: string;
    var notification: CreateNotificationInput = {
      userId: '',
      detailPath: '',
      content: '',
    };
    // service + facilityName
    if (regis.typeOfService === ETypeOfService.Doctor) {
      const doctor = await this.doctorLoader.load(regis.doctorId);
      service = doctor.doctorName;
      facilityName = (
        await this.facilityLoaderSrv.load(doctor.medicalFactilitiesId)
      ).medicalFacilityName;
    }
    if (regis.typeOfService === ETypeOfService.Package) {
      const p = await this.packageLoader.load(regis.packageId);
      service = p.packageName;
      facilityName = (await this.facilityLoaderSrv.load(p.medicalFactilitiesId))
        .medicalFacilityName;
    }
    if (regis.typeOfService === ETypeOfService.Specialty) {
      const specialty = await this.specialtyLoader.load(regis.specialtyId);
      service = specialty.specialtyName;
      facilityName = (
        await this.facilityLoaderSrv.load(specialty.medicalFactilityId)
      ).medicalFacilityName;
    }
    if (regis.typeOfService === ETypeOfService.Vaccine) {
      const vaccine = await this.vaccinationLoader.load(regis.vaccineId);
      service = vaccine.vaccineName;
      facilityName = (
        await this.facilityLoaderSrv.load(vaccine.medicalFactilitiesId)
      ).medicalFacilityName;
    }
    // gán
    if (profile && customer) {
      notification.userId = customer.userId;
      const date: string = `${regis.date.getDate()}/${
        regis.date.getMonth() + 1
      }/${regis.date.getFullYear()}`;
      if (regis.state === EStateRegister.Approved) {
        notification.content = `Đã duyệt đăng ký ${regis.typeOfService} "${service}" bệnh nhân đến "${facilityName}" trước "${regis.session.startTime}" ngày "${date}"`;
        notification.detailPath = '/account/ticket';
        if (isShare)
          this.createNottifyAndEmailByCustomerKey(
            regis,
            notification.content,
            notification.detailPath,
          );
        this.emailService.sendUserConfirmation(
          profile.email,
          customer.fullname,
          profile.fullname,
          regis.typeOfService,
          service,
          date,
          regis.session.startTime,
          regis.session.endTime,
        );
      } else if (regis.state === EStateRegister.Success) {
        notification.content = `Hoàn thành ${regis.typeOfService} "${service}" cảm ơn bạn đã chọn dịch vụ của "${facilityName}"`;
        notification.detailPath = `/account/ticket/${regis.id}`;
        if (isShare)
          this.createNottifyAndEmailByCustomerKey(
            regis,
            notification.content,
            notification.detailPath,
          );
        this.emailService.sendUserSuccesss(
          profile.email,
          customer.fullname,
          profile.fullname,
          regis.typeOfService,
          service,
          date,
          regis.session.startTime,
          regis.session.endTime,
        );
      } else if (regis.state === EStateRegister.Pending) {
        notification.content = `Bạn đã đăng ký ${regis.typeOfService} "${service}" với hồ sơ "${profile.fullname}" vui lòng chờ thông báo xác nhận của "${facilityName}"`;
        notification.detailPath = '/account/ticket';
        if (isShare)
          this.createNottifyAndEmailByCustomerKey(
            regis,
            notification.content,
            notification.detailPath,
          );
      }
    }
    // subscription cho user
    await this.notificationSrv
      .create(notification)
      .then((res) => this.notificationResolver.emitNotifyCreatedEvent(res));
  }
  async createNottifyAndEmailByCustomerKey(
    regis: Register,
    content: string,
    detailPath: string,
  ) {
    if (regis.createdBy) {
      const customer: Customer = await this.customerSrv.findByCustomerKey(
        regis.createdBy,
      );
      var notification: CreateNotificationInput = {
        userId: '',
        detailPath: detailPath,
        content: content,
      };

      if (customer) {
        notification.userId = customer.userId;
      }
      // subscription cho user
      await this.notificationSrv
        .create(notification)
        .then((res) => this.notificationResolver.emitNotifyCreatedEvent(res));
    }
  }
  async getServiceIds(facilityId: string): Promise<IServiceIds> {
    const doctorIds: string[] =
      await this.registerLoader.loadDoctorIdsByFacilityId(facilityId);
    const packageIds: string[] =
      await this.registerLoader.loadPackageIdsByFacilityId(facilityId);
    const vaccinatioIds: string[] =
      await this.registerLoader.loadVaccinationIdsByFacilityId(facilityId);
    const specialtyIds: string[] =
      await this.registerLoader.loadSpecialtyIdsByFacilityId(facilityId);

    return {
      doctorsIds: doctorIds,
      packagesIds: packageIds,
      vaccinesIds: vaccinatioIds,
      specialtiesIds: specialtyIds,
    };
  }
}
