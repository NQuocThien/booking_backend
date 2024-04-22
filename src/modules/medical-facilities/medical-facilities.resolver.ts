import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MedicalFacilitiesService } from './medical-facilities.service';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { CreateMedicalFacilityInput } from './entities/dto/create-medical-facilities.input';
import { Doctor } from '../doctors/entities/doctor.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/entities/role.enum';
import { UpdateMedicalFacilityInput } from './entities/dto/update-medical-facilities.input';
import deleteImage from 'src/utils/delete_image';
import { Package } from '../package/entities/package.entity';
import { PackageService } from '../package/package.service';
import { Vaccination } from '../vaccination/entities/Vaccination.entity';
import { VaccinationService } from '../vaccination/vaccination.service';
import { MedicalSpecialties } from '../medical-specialties/entities/medical-specialties.entity';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { MedicalStaff } from '../medical-staff/entities/medical-staff.entity';
import {
  EPermission,
  EStatusService,
  ETypeOfFacility,
  ETypeOfService,
} from 'src/contain';

@Resolver(() => MedicalFacilities)
export class MedicalFacilitiesResolver {
  constructor(
    private readonly medicalService: MedicalFacilitiesService,
    private readonly doctorService: DoctorsService,
    private readonly packageSrv: PackageService,
    private readonly vaccineSvr: VaccinationService,
    private readonly specialtySrv: MedicalSpecialtiesService,
    private readonly staffSvr: MedicalStaffService,
  ) {}
  // @UseGuards(JWtAuthGuard, RolesGuard)
  @Query(() => [MedicalFacilities], { name: 'getAllMedicalFacility' })
  async getAllMedicalFacility(): Promise<MedicalFacilities[]> {
    return await this.medicalService.findAll();
  }

  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Facility)
  @Roles(Role.Staff)
  @Query(() => MedicalFacilities, { name: 'getMedicalFacilityInfo' })
  async getMedicalFacilityInfo(
    @Args('userId', { nullable: true, defaultValue: '' }) userId: String,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: String,
  ): Promise<MedicalFacilities> {
    if (userId !== '') {
      const result = await this.medicalService.findOneByUserId(userId);
      return result;
    } else {
      if (staffId !== '') {
        const staff = await this.staffSvr.findById(staffId);
        if (staff.permissions.includes(EPermission.Magager)) {
          const result = await this.medicalService.findById(
            staff.medicalFacilityId,
          );
          return result;
        }
      }
    }
  }

  @Query(() => MedicalFacilities, { name: 'getMedicalFacilityById' })
  async getMedicalFacilityById(
    @Args('id') id: String,
  ): Promise<MedicalFacilities> {
    const result = await this.medicalService.findById(id);
    return result;
  }

  @Query(() => [MedicalFacilities], { name: 'getAllMedicalFacilityPagination' })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalFacilityPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'medicalFacilityName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('type', { nullable: true }) type: ETypeOfFacility,
  ): Promise<MedicalFacilities[]> {
    // console.log('test: ', type);
    const user = await this.medicalService.getAllMedicalFacilityPagination(
      search,
      page,
      limit,
      sortField,
      sortOrder,
      type,
    );
    return user;
  }

  @Query(() => [MedicalFacilities], {
    name: 'getAllMedicalFacilityPaginationForClient',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalFacilityPaginationForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('searchField', {
      nullable: true,
      defaultValue: 'medicalFacilityName',
    })
    searchField: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'medicalFacilityName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('type', { nullable: true }) type: ETypeOfFacility,
  ): Promise<MedicalFacilities[]> {
    // console.log('test: ', type);
    const user =
      await this.medicalService.getAllMedicalFacilityPaginationForClient(
        search,
        searchField,
        page,
        limit,
        sortField,
        sortOrder,
        type,
      );
    return user;
  }

  @Query(() => [MedicalFacilities], {
    name: 'getAllMedicalFacilityHaveSrvPaginationForClient',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalFacilityHaveServrvinationForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'medicalFacilityName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('type', { nullable: true }) type: ETypeOfService,
  ): Promise<MedicalFacilities[]> {
    const facilies =
      await this.medicalService.getAllMedicalFacilityHaveSrvPagination(
        search,
        page,
        limit,
        sortField,
        sortOrder,
        type,
      );
    return facilies;
  }

  @Query(() => Number, { name: 'getTotalFacilitiesHaveSrvCountForClient' })
  async getTotalFacilitiesHaveSrvCountForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('type', { nullable: true }) type: ETypeOfService,
  ): Promise<number> {
    const count =
      await this.medicalService.getTotalFacilitiesHaveSrvCountForClient(
        search || '',
        type,
      );
    return count;
  }

  @Query(() => [MedicalFacilities], { name: 'getTopMedicalFacilities' })
  // @UseGuards(JWtAuthGuard)
  async getTopMedicalFacilities(
    @Args('typeFacility')
    type: ETypeOfFacility,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<MedicalFacilities[]> {
    {
      const user = await this.medicalService.getTopMedicalFacilities(
        limit,
        type,
      );
      return user;
    }
  }

  @Query(() => Number, { name: 'getTotalFacilitiesCount' })
  async getTotalFacilitiesCount(
    @Args('search', { nullable: true }) search: string,
    @Args('type', { nullable: true }) type: ETypeOfFacility,
  ): Promise<number> {
    const count = await this.medicalService.getTotalFacilitiesCount(
      search || '',
      type,
    );
    return count;
  }

  @Query(() => Number, { name: 'getTotalFacilitiesCountForClient' })
  async getTotalFacilitiesCountForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('searchField', {
      nullable: true,
      defaultValue: 'medicalFacilityName',
    })
    searchField: string,
    @Args('type', { nullable: true }) type: ETypeOfFacility,
  ): Promise<number> {
    const count = await this.medicalService.getTotalFacilitiesCountForClient(
      search || '',
      searchField,
      type,
    );
    return count;
  }

  @Mutation(() => MedicalFacilities, { name: 'createMedicalFacility' })
  async createMedicalFacility(
    @Args('input')
    input: CreateMedicalFacilityInput,
  ): Promise<MedicalFacilities> {
    return await this.medicalService.createMedicalFacility(input);
  }

  @Mutation(() => MedicalFacilities, { name: 'updateMedicalFacility' })
  async updateMedicalFacility(
    @Args('input')
    input: UpdateMedicalFacilityInput,
  ): Promise<MedicalFacilities> {
    try {
      const oldData = await this.medicalService.findById(input.id);
      const compareLogo =
        JSON.stringify(oldData.logo) !== JSON.stringify(input.logo);
      const compareImage =
        JSON.stringify(oldData.image) !== JSON.stringify(input.image);
      console.log(' ---> delete old logo: ', compareLogo);
      if (compareLogo) {
        await deleteImage(oldData.logo, 'facilities');
      }
      console.log(' ---> delete old image:', compareImage);
      if (compareImage) {
        await deleteImage(oldData.image, 'facilities');
      }
      return this.medicalService.updateMedicalFacilities(input);
    } catch (e) {
      console.log('Error', e.message);
    }

    return await this.medicalService.updateMedicalFacilities(input);
  }
  @Mutation(() => MedicalFacilities, { name: 'deleteMedicalFacility' })
  async deleteMedicalFacility(
    @Args('input')
    id: String,
  ): Promise<MedicalFacilities> {
    try {
      const oldData = await this.medicalService.findById(id);
      console.log(' ---> delete old logo');
      await deleteImage(oldData.logo, 'facilities');
      console.log(' ---> delete old image');
      await deleteImage(oldData.image, 'facilities');
      return this.medicalService.delete(id);
    } catch (e) {
      console.log('Error', e.message);
    }
  }

  @ResolveField(() => [Doctor], { name: 'doctors' })
  async doctors(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient?: boolean,
  ): Promise<Doctor[]> {
    if (!isClient) {
      const docs = await this.doctorService.findByFacilitiesId(mf.id);
      return docs;
    } else {
      const docs = await this.doctorService.findByFacilitiesId(mf.id);
      const filtered = docs.filter(
        (doc) => doc.workSchedule.status === EStatusService.Open,
      );
      return filtered;
    }
  }

  @ResolveField(() => [Package], { name: 'packages' })
  async packages(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient?: boolean,
  ): Promise<Package[]> {
    if (!isClient) {
      return await this.packageSrv.findByMedicalFacilityId(mf.id);
    } else {
      const packages = await this.packageSrv.findByMedicalFacilityId(mf.id);
      const packagesOpen = packages.filter(
        (p) => p.workSchedule.status === EStatusService.Open,
      );
      return packagesOpen;
    }
  }

  @ResolveField(() => [Vaccination], { name: 'vaccinations' })
  async vaccinations(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient?: boolean,
  ): Promise<Vaccination[]> {
    if (!isClient) return await this.vaccineSvr.findByMedicalFacilityId(mf.id);
    else {
      const vaccination = await this.vaccineSvr.findByMedicalFacilityId(mf.id);
      const vaccinationOpen = vaccination.filter(
        (p) => p.workSchedule.status === EStatusService.Open,
      );
      return vaccinationOpen;
    }
  }

  @ResolveField(() => [MedicalSpecialties], { name: 'medicalSpecialties' })
  async medicalSpecialties(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient?: boolean,
  ): Promise<MedicalSpecialties[]> {
    if (!isClient)
      return await this.specialtySrv.findByMedicalFacilityId(mf.id);
    else {
      const specialties = await this.specialtySrv.findByMedicalFacilityId(
        mf.id,
      );
      const specialtiesOpen = specialties.filter(
        (p) => p.workSchedule.status === EStatusService.Open,
      );
      return specialtiesOpen;
    }
  }
  @ResolveField(() => [MedicalSpecialties], { name: 'medicalStaffs' })
  async medicalStaffs(
    @Parent() mf: MedicalFacilities,
  ): Promise<MedicalStaff[]> {
    return await this.staffSvr.findByMedicalFacilityId(mf.id);
  }

  @ResolveField(() => Number, { name: 'totalPackages' })
  async totalPackages(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient: boolean,
  ): Promise<number> {
    if (!isClient)
      return await this.packageSrv.getTotalPackagesCountByFacilityId(mf.id);
    else {
      return await this.packageSrv.getTotalPackagesCountByFacilityId(
        mf.id,
        isClient,
      );
    }
  }

  @ResolveField(() => Number, { name: 'totalDoctors' })
  async totalDoctors(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient: boolean,
  ): Promise<number> {
    if (!isClient)
      return await this.doctorService.getTotalPackagesCountByFacilityId(mf.id);
    else {
      return await this.doctorService.getTotalPackagesCountByFacilityId(
        mf.id,
        isClient,
      );
    }
  }

  @ResolveField(() => Number, { name: 'totalSpecialties' })
  async totalSpecialties(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient: boolean,
  ): Promise<number> {
    if (!isClient)
      return await this.specialtySrv.getTotalSpacialtyCountByFacilityId(mf.id);
    else {
      return await this.specialtySrv.getTotalSpacialtyCountByFacilityId(
        mf.id,
        isClient,
      );
    }
  }

  @ResolveField(() => Number, { name: 'totalVaccinations' })
  async totalVaccinations(
    @Parent() mf: MedicalFacilities,
    @Args('isClient', { nullable: true, defaultValue: false })
    isClient: boolean,
  ): Promise<number> {
    if (!isClient)
      return await this.vaccineSvr.getTotalPackagesCountByFacilityId(mf.id);
    else {
      return await this.vaccineSvr.getTotalPackagesCountByFacilityId(
        mf.id,
        isClient,
      );
    }
  }
}
