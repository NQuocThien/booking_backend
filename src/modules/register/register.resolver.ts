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
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { RegisterLoaderService } from './register-loader.service';
import { GetRegisPendingInput } from './entities/dtos/get-regis-pending.input';
import { start } from 'repl';
import { GetRegisHistoryInput } from './entities/dtos/get-register-history.input copy';
import { FacilitiesLoaderService } from '../medical-facilities/facility-loader';
import { StaffLoaderService } from '../medical-staff/staff-loader';
import { profile } from 'console';
import { MailService } from '../mail/mail.service';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.entity';
import { EStateRegister, ETypeOfService } from 'src/contain';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationInput } from '../notification/entities/dtos/create-notification.input';
const pubSub = new PubSub();

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
    private readonly emailService: MailService,
  ) {}
  // =============================== --> QUERY <--- ==================================
  @Query(() => [Register], { name: 'getAllRegisterByOption' })
  async getAllRegisterByOption(
    @Args('input') input: GetRegisterByOptionInput,
  ): Promise<Register[]> {
    return await this.regisService.getAllRegisterByOption(input);
  }

  @Query(() => [Register], { name: 'getAllRegisPending' })
  async getAllRegisPending(
    @Args('input') input: GetRegisPendingInput,
  ): Promise<any> {
    return await this.regisService.getAllRegisPending(input);
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
        const doctorIds: string[] =
          await this.registerLoader.loadDoctorIdsByFacilityId(facility.id);
        const packageIds: string[] =
          await this.registerLoader.loadPackageIdsByFacilityId(facility.id);
        const vaccinatioIds: string[] =
          await this.registerLoader.loadVaccinationIdsByFacilityId(facility.id);
        const specialtyIds: string[] =
          await this.registerLoader.loadSpecialtyIdsByFacilityId(facility.id);
        const input: GetRegisHistoryInput = {
          profileId: profileId,
          doctorIds: doctorIds,
          packageIds: packageIds,
          specialtyIds: specialtyIds,
          vaccineIds: vaccinatioIds,
        };
        return await this.regisService.getRegisHistory(input, 'date', 'desc');
      }
    } else {
      if (staffId !== '') {
        const staff = await this.staffLoaderSrv.load(staffId);
        if (staff) {
          const doctorIds: string[] =
            await this.registerLoader.loadDoctorIdsByFacilityId(
              staff.medicalFacilityId,
            );
          const packageIds: string[] =
            await this.registerLoader.loadPackageIdsByFacilityId(
              staff.medicalFacilityId,
            );
          const vaccinatioIds: string[] =
            await this.registerLoader.loadVaccinationIdsByFacilityId(
              staff.medicalFacilityId,
            );
          const specialtyIds: string[] =
            await this.registerLoader.loadSpecialtyIdsByFacilityId(
              staff.medicalFacilityId,
            );
          const input: GetRegisHistoryInput = {
            profileId: profileId,
            doctorIds: doctorIds,
            packageIds: packageIds,
            specialtyIds: specialtyIds,
            vaccineIds: vaccinatioIds,
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
    const isExist: Boolean = await this.regisService.isExistInDay(
      input.date.toDateString(),
      input.session,
      input.profileId,
    );
    if (!isExist) {
      const res = await this.regisService.createRegisterDoctor(input);
      this.registerLoader.clean(input.profileId);
      this.emitRegisterPendingCreatedEvent(res);
      return res;
    }
    throw new Error('!Regis Exist');
  }

  @Mutation(() => Register, { name: 'createRegisterSpecialty' })
  async createRegisterSpecialty(
    @Args('input') input: CreateRegisterSpecialtyInput,
  ): Promise<Register> {
    const isExist: Boolean = await this.regisService.isExistInDay(
      input.date.toDateString(),
      input.session,
      input.profileId,
    );
    if (!isExist) {
      const regiter = await this.regisService.createRegisterSpecialty(input);
      this.registerLoader.clean(input.profileId);
      this.emitRegisterPendingCreatedEvent(regiter);
      return regiter;
    }
    throw new Error('!Regis Exist');
  }

  @Mutation(() => Register, { name: 'createRegisterPackage' })
  async createRegisterPackage(
    @Args('input') input: CreateRegisterPackageInput,
  ): Promise<Register> {
    const isExist: Boolean = await this.regisService.isExistInDay(
      input.date.toDateString(),
      input.session,
      input.profileId,
    );
    if (!isExist) {
      const res = await this.regisService.createRegisterPackage(input);
      this.registerLoader.clean(input.profileId);
      this.emitRegisterPendingCreatedEvent(res);

      return res;
    }
    throw new Error('!Regis Exist');
  }

  @Mutation(() => Register, { name: 'createRegisterVaccine' })
  async createRegisterVaccine(
    @Args('input') input: CreateRegisterVaccineInput,
  ): Promise<Register> {
    const isExist: Boolean = await this.regisService.isExistInDay(
      input.date.toDateString(),
      input.session,
      input.profileId,
    );
    if (!isExist) {
      const res = await this.regisService.createRegisterVaccine(input);
      this.registerLoader.clean(input.profileId);
      this.emitRegisterPendingCreatedEvent(res);
      return res;
    }
    throw new Error('!Regis Exist');
  }

  @Mutation(() => Register, { name: 'updateRegister' })
  async updateRegister(
    @Args('input') input: UpdateRegisterInput,
  ): Promise<Register> {
    return await this.regisService.update(input);
  }

  @Mutation(() => Register, { name: 'cancelRegister' })
  async cancelRegister(@Args('id') id: string): Promise<Register> {
    return await this.regisService.cancelRegis(id);
  }

  @Mutation(() => Register, { name: 'confirmRegister' })
  async confirmRegister(
    @Args('input') input: ConfirmRegisterInput,
  ): Promise<Register> {
    const regis = await this.regisService.confirmRegister(input);
    this.callEmitRegisterCreatedEvent(regis);

    const profile: Profile = await this.profileSvr.findById(regis.profileId);
    const customer: Customer = await this.customerSrv.findById(
      profile.customerId,
    );
    var service: string;
    var notification: CreateNotificationInput = {
      userId: '',
      detailPath: '/account/ticket',
      content: '',
    };
    if (regis.typeOfService === ETypeOfService.Doctor) {
      service = (await this.doctorLoader.load(regis.doctorId)).doctorName;
    }
    if (regis.typeOfService === ETypeOfService.Package) {
      service = (await this.packageLoader.load(regis.packageId)).packageName;
    }
    if (regis.typeOfService === ETypeOfService.Specialty) {
      service = (await this.specialtyLoader.load(regis.specialtyId))
        .specialtyName;
    }
    if (regis.typeOfService === ETypeOfService.Vaccine) {
      service = (await this.vaccinationLoader.load(regis.vaccineId))
        .vaccineName;
    }

    if (profile && customer) {
      notification.userId = customer.userId;
      const date: string = `${regis.date.getDate()} / ${
        regis.date.getMonth() + 1
      } / ${regis.date.getFullYear()}`;
      if (regis.state === EStateRegister.Approved) {
        notification.content = `Đã duyệt ${regis.typeOfService} "${service}"`;
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
        notification.content = `Đã khám ${regis.typeOfService} "${service}"`;
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
      }
    }
    this.notificationSrv.create(notification);
    return regis;
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
  async registerPendingCreated(@Args('option') option: GetRegisPendingInput) {
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
      // console.log('Call Specialties:', regis.specialtyId);
      const data = await this.specialtyLoader.load(regis.specialtyId);
      // console.log('Call Specialties data', data);

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
}
