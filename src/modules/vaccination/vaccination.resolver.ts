import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationService } from './vaccination.service';
import { CreateVaccineInput } from './entities/dto/create-vaccination.input';
import { UpdateVaccineInput } from './entities/dto/update-vaccination.input';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { EPermission } from 'src/contain';
import { UnauthorizedException } from '@nestjs/common';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';
import { RegisterService } from '../register/register.service';
import { FacilitiesLoaderService } from '../medical-facilities/facility-loader';

@Resolver(() => Vaccination)
export class VaccinationResolver {
  constructor(
    private readonly vaccinationService: VaccinationService,
    private readonly facilitySvr: MedicalFacilitiesService,
    private readonly staffSvr: MedicalStaffService,
    private readonly facilityLoaderSvr: FacilitiesLoaderService,
    private readonly registerSrv: RegisterService,
  ) {}

  @Query(() => [Vaccination], { name: 'getAllVacation' })
  async getAllVacation(): Promise<Vaccination[]> {
    return await this.vaccinationService.getAllVaccination();
  }

  @Query(() => Vaccination, { name: 'getVaccineById' })
  async getVaccineById(@Args('input') input: String): Promise<Vaccination> {
    return await this.vaccinationService.findById(input);
  }

  @Query(() => [Vaccination], { name: 'getAllVaccinationSelect' })
  async getAllVaccinationSelect(
    @Args('input') input: String,
  ): Promise<Vaccination[]> {
    return await this.vaccinationService.findByMedicalFacilityId(input);
  }

  @Query(() => [Vaccination], { name: 'getAllVaccinationByFacilityId' })
  async getAllVaccinationByFacilityId(
    @Args('input') input: String,
  ): Promise<Vaccination[]> {
    return await this.vaccinationService.findByMedicalFacilityId(input);
  }

  @Query(() => [Vaccination], { name: 'getAllVaccinationPaginationOfFacility' })
  // @UseGuards(JWtAuthGuard)
  async getAllVaccinationPaginationOfFacility(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'vaccineName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<Vaccination[]> {
    {
      if (userId !== '') {
        const facility = await this.facilitySvr.findOneByUserId(userId);
        if (facility) {
          const docs =
            await this.vaccinationService.getAllVaccinationPaginationOfFacility(
              search,
              page,
              limit,
              sortField,
              sortOrder,
              facility.id,
            );
          return docs;
        } else return null;
      } else {
        if (staffId !== '') {
          const staff = await this.staffSvr.findById(staffId);
          if (staff) {
            const docs =
              await this.vaccinationService.getAllVaccinationPaginationOfFacility(
                search,
                page,
                limit,
                sortField,
                sortOrder,
                staff.medicalFacilityId,
              );
            return docs;
          } else return null;
        }
      }
    }
  }

  @Query(() => [Vaccination], { name: 'getAllVaccinationOfFacility' })
  // @UseGuards(JWtAuthGuard)
  async getAllVaccinationOfFacility(
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<Vaccination[]> {
    {
      if (userId !== '') {
        const facility = await this.facilitySvr.findOneByUserId(userId);
        if (facility) {
          const docs =
            await this.vaccinationService.getAllVaccinationOfFacility(
              facility.id,
            );
          return docs;
        } else return null;
      } else {
        if (staffId !== '') {
          const staff = await this.staffSvr.findById(staffId);
          if (staff) {
            const docs =
              await this.vaccinationService.getAllVaccinationOfFacility(
                staff.medicalFacilityId,
              );
            return docs;
          } else return null;
        }
      }
    }
  }
  @Query(() => [Vaccination], {
    name: 'getAllVaccinationPaginationOfFacilityForClient',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllVaccinationPaginationOfFacilityForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'vaccineName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('facilityId') facilityId: string,
  ): Promise<Vaccination[]> {
    const docs =
      await this.vaccinationService.getAllVaccinationPaginationOfFacility(
        search,
        page,
        limit,
        sortField,
        sortOrder,
        facilityId,
        true,
      );
    return docs;
  }
  @Query(() => [Vaccination], { name: 'getAllVaccinationPaginationByStaff' })
  // @UseGuards(JWtAuthGuard)
  async getAllVaccinationPaginationByStaff(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('staffId', { nullable: true }) staffId: string,
  ): Promise<Vaccination[]> {
    {
      const staff = await this.staffSvr.findById(staffId);
      if (staff && staff.permissions.includes(EPermission.MagagerVaccine)) {
        const docs =
          await this.vaccinationService.getAllVaccinationPaginationOfFacility(
            search,
            page,
            limit,
            sortField,
            sortOrder,
            staff.medicalFacilityId,
          );
        return docs;
      } else throw new UnauthorizedException();
    }
  }

  @Query(() => Number, { name: 'getTotalVaccinationsCount' })
  async getTotalVaccinationsCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId?: string,
  ): Promise<number> {
    if (userId === '') {
      if (staffId !== '') {
        const staff = await this.staffSvr.findById(staffId);
        if (
          staff &&
          (staff.permissions.includes(EPermission.MagagerVaccine) ||
            staff.permissions.includes(EPermission.Magager))
        ) {
          const count =
            await this.vaccinationService.getTotalVaccinationsCountOfFacility(
              search || '',
              staff.medicalFacilityId,
            );
          return count;
        } else throw new UnauthorizedException();
      } else {
        const count = await this.vaccinationService.getTotalVaccinationsCount(
          search || '',
        );
        return count;
      }
    } else {
      const facility = await this.facilitySvr.findOneByUserId(userId);
      if (facility) {
        const count =
          await this.vaccinationService.getTotalVaccinationsCountOfFacility(
            search || '',
            facility.id,
          );
        return count;
      }
      return null;
    }
  }

  @Query(() => Number, { name: 'getTotalVaccinationsCountForClient' })
  async getTotalVaccinationsCountForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('facilityId') facilityId: string,
  ): Promise<number> {
    const count =
      await this.vaccinationService.getTotalVaccinationsCountOfFacility(
        search || '',
        facilityId,
        true,
      );
    return count;
  }
  @Mutation(() => Vaccination, { name: 'createVaccination' })
  async createVaccination(
    @Args('input') input: CreateVaccineInput,
  ): Promise<Vaccination> {
    return await this.vaccinationService.create(input);
  }

  @Mutation(() => Vaccination, { name: 'updateVaccination' })
  async updateVaccination(
    @Args('input') input: UpdateVaccineInput,
  ): Promise<Vaccination> {
    return await this.vaccinationService.update(input);
  }

  @Mutation(() => Vaccination, { name: 'deleteVaccination' })
  async deleteVaccination(@Args('input') input: String): Promise<Vaccination> {
    return await this.vaccinationService.delete(input);
  }

  @ResolveField(() => MedicalFacilities, { name: 'facility' })
  async facility(@Parent() vaccine: Vaccination): Promise<MedicalFacilities> {
    return this.facilitySvr.findById(vaccine.medicalFactilitiesId);
  }

  @ResolveField(() => Number, { name: 'registerCount' })
  async registerCount(
    @Parent() vaccination: Vaccination,
    @Args('startTime') startTime: string,
    @Args('endTime') endTime: string,
    @Args('isPending', { nullable: true, defaultValue: false })
    isPending: boolean,
  ): Promise<number> {
    const count = this.registerSrv.regisVaccinationCount(
      vaccination.id,
      startTime,
      endTime,
      isPending,
    );
    return count;
  }
}
