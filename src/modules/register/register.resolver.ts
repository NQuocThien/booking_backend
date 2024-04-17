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
import { DoctorsService } from '../doctors/doctors.service';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';
import { PackageService } from '../package/package.service';
import { VaccinationService } from '../vaccination/vaccination.service';
import { Package } from '../package/entities/package.entity';
import { Vaccination } from '../vaccination/entities/Vaccination.entity';
import { MedicalSpecialties } from '../medical-specialties/entities/medical-specialties.entity';
import { RegisterLoaderService } from './register-loader.service';
import { MedicalSpecialtiesLoaderService } from '../medical-specialties/medical-specialties-loader.service';
import { PackageLoaderService } from '../package/package-loader.service';
import { DoctorLoaderService } from '../doctors/doctor-loader.service';
import { VaccinationLoaderService } from '../vaccination/vaccination-loader.service';
const pubSub = new PubSub();

@Resolver(() => Register)
export class RegisterResolver {
  constructor(
    private readonly regisService: RegisterService,
    private readonly profileSvr: ProfileService,
    private readonly doctorSrv: DoctorsService,
    private readonly specialtySrv: MedicalSpecialtiesService,
    private readonly packageSrv: PackageService,
    private readonly vaccinationSrv: VaccinationService,
    private readonly registeredSrv: RegisterLoaderService,
    private readonly specialtyLoader: MedicalSpecialtiesLoaderService,
    private readonly packageLoader: PackageLoaderService,
    private readonly doctorLoader: DoctorLoaderService,
    private readonly vaccinationLoader: VaccinationLoaderService,
    private readonly pubSub: PubSub,
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
    @Args('input') input: GetRegisterByOptionInput,
  ): Promise<any> {
    return await this.regisService.getAllRegisPending(input);
  }

  // =============================== --> MUTATION <--- ==================================

  @Mutation(() => Register, { name: 'createRegisterDoctor' })
  async createRegisterDoctor(
    @Args('input') input: CreateRegisterDoctorInput,
  ): Promise<Register> {
    const res = await this.regisService.createRegisterDoctor(input);
    // console.log('Create Register Doctor: ', res);
    this.emitRegisterCreatedEvent(res);
    return res;
  }

  @Mutation(() => Register, { name: 'createRegisterSpecialty' })
  async createRegisterSpecialty(
    @Args('input') input: CreateRegisterSpecialtyInput,
  ): Promise<Register> {
    const regiter = await this.regisService.createRegisterSpecialty(input);
    this.emitRegisterCreatedEvent(regiter);
    return regiter;
  }

  @Mutation(() => Register, { name: 'createRegisterPackage' })
  async createRegisterPackage(
    @Args('input') input: CreateRegisterPackageInput,
  ): Promise<Register> {
    const res = await this.regisService.createRegisterPackage(input);
    this.emitRegisterCreatedEvent(res);

    return res;
  }

  @Mutation(() => Register, { name: 'createRegisterVaccine' })
  async createRegisterVaccine(
    @Args('input') input: CreateRegisterVaccineInput,
  ): Promise<Register> {
    const res = await this.regisService.createRegisterVaccine(input);
    this.emitRegisterCreatedEvent(res);

    return res;
  }

  @Mutation(() => Register, { name: 'updateRegister' })
  async updateRegister(
    @Args('input') input: UpdateRegisterInput,
  ): Promise<Register> {
    return await this.regisService.update(input);
  }

  @Mutation(() => Register, { name: 'confirmRegister' })
  async confirmRegister(
    @Args('input') input: ConfirmRegisterInput,
  ): Promise<Register> {
    return await this.regisService.confirmRegister(input);
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
      const vaccineId = variables.option.vaccineId;
      const inputDate = variables.option.date;
      if (doctorId) {
        if (
          doctorId === payload.registerCreated.doctorId &&
          isEqualDate(inputDate, payload.registerCreated.date)
        ) {
          return true;
        }
        return false;
      }
      if (packageId) {
        if (
          packageId === payload.registerCreated.packageId &&
          isEqualDate(inputDate, payload.registerCreated.date)
        )
          return true;
        return false;
      }
      if (specialtyId) {
        if (
          specialtyId === payload.registerCreated.specialtyId &&
          isEqualDate(inputDate, payload.registerCreated.date)
        )
          return true;
        return false;
      }
      if (vaccineId) {
        if (
          vaccineId === payload.registerDoctorCreated.vaccineId &&
          isEqualDate(inputDate, payload.registerDoctorCreated.date)
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

  private async emitRegisterCreatedEvent(register: Register): Promise<void> {
    await pubSub.publish('registerCreated', { registerCreated: register });
  }

  //----------------------------------------------------------------

  private async emitRegisterDoctorCreatedEvent(
    register: Register,
  ): Promise<void> {
    await this.pubSub.publish('registerDoctorCreated', {
      registerDoctorCreated: register,
    });
  }

  @Subscription(() => Register, {
    name: 'registerDoctorCreated',
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
      if (
        variables.doctorId === payload.registerDoctorCreated.doctorId &&
        isEqualDate(variables.date, payload.registerDoctorCreated.date)
      )
        return true;
      return false;
    },
  })
  async registerDoctorCreated(
    @Args('doctorId') doctorId: string,
    @Args('date') date: string,
  ) {
    const res = this.pubSub.asyncIterator('registerDoctorCreated');
    return res;
  }

  //----------------------------------------------------------------
  //----------------------------------------------------------------
  @Subscription(() => Register, { name: 'registerSpecialtyCreated' })
  async registerSpecialtyCreated() {
    return pubSub.asyncIterator('registerSpecialtyCreated');
  }

  private async emitRegisterSpecialtCreatedEvent(
    register: Register,
  ): Promise<void> {
    await pubSub.publish('registerSpecialtyCreated', {
      registerSpecialtyCreated: register,
    });
  }
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  @Subscription(() => Register, { name: 'registerPackageCreated' })
  async registerPackageCreated() {
    return pubSub.asyncIterator('registerPackageCreated');
  }

  private async emitRegisterPackageCreatedEvent(
    register: Register,
  ): Promise<void> {
    await pubSub.publish('registerPackageCreated', {
      registerPackageCreated: register,
    });
  }
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  @Subscription(() => Register, { name: 'registerVaccinationCreated' })
  async registerVaccinationCreated() {
    return pubSub.asyncIterator('registerVaccinationCreated');
  }

  private async emitRegisterVacinationCreatedEvent(
    register: Register,
  ): Promise<void> {
    await pubSub.publish('registerVaccinationCreated', {
      registerVaccinationCreated: register,
    });
  }
  //----------------------------------------------------------------

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
