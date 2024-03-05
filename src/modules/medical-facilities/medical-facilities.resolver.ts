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
import { UseGuards } from '@nestjs/common';
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
  @Roles(Role.Clinic)
  @Query(() => MedicalFacilities, { name: 'getMedicalFacilityByUserId' })
  async getMedicalFacilityByUserId(
    @Args('id') id: String,
  ): Promise<MedicalFacilities> {
    const result = await this.medicalService.findOneByUserId(id);
    return result;
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
  ): Promise<MedicalFacilities[]> {
    {
      const user = await this.medicalService.getAllMedicalFacilityPagination(
        search,
        page,
        limit,
        sortField,
        sortOrder,
      );
      return user;
    }
  }

  @Query(() => Number, { name: 'getTotalFacilitiesCount' })
  async getTotalFacilitiesCount(
    @Args('search', { nullable: true }) search?: string,
  ): Promise<number> {
    const count = await this.medicalService.getTotalFacilitiesCount(
      search || '',
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
  async doctors(@Parent() mf: MedicalFacilities): Promise<Doctor[]> {
    const docs = await this.doctorService.findByFacilitiesId(mf.id);
    return docs;
  }

  @ResolveField(() => [Package], { name: 'packages' })
  async packages(@Parent() mf: MedicalFacilities): Promise<Package[]> {
    return await this.packageSrv.findByMedicalFacilityId(mf.id);
  }

  @ResolveField(() => [Vaccination], { name: 'vaccinations' })
  async vaccinations(@Parent() mf: MedicalFacilities): Promise<Vaccination[]> {
    return await this.vaccineSvr.findByMedicalFacilityId(mf.id);
  }

  @ResolveField(() => [MedicalSpecialties], { name: 'medicalSpecialties' })
  async medicalSpecialties(
    @Parent() mf: MedicalFacilities,
  ): Promise<MedicalSpecialties[]> {
    return await this.specialtySrv.findByMedicalFacilityId(mf.id);
  }
  @ResolveField(() => [MedicalSpecialties], { name: 'medicalStaffs' })
  async medicalStaffs(
    @Parent() mf: MedicalFacilities,
  ): Promise<MedicalStaff[]> {
    return await this.staffSvr.findByMedicalFacilityId(mf.id);
  }
}
