import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { CreateMedicalSpecialtyInput } from './entities/dtos/create-medical-specialties.input';
import { UpdateMedicalSpecialtyInput } from './entities/dtos/update-medical-specialties.input';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { EPermission } from 'src/contain';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';
import { FacilitiesLoaderService } from '../medical-facilities/facility-loader';
import { RegisterService } from '../register/register.service';

@Resolver(() => MedicalSpecialties)
export class MedicalSpecialtiesResolver {
  constructor(
    private readonly medicalSpecialtiesService: MedicalSpecialtiesService,
    private readonly facilitySvr: MedicalFacilitiesService,
    private readonly staffSvr: MedicalStaffService,
    private readonly facilityLoaderSrv: FacilitiesLoaderService,
    private readonly registerSrv: RegisterService,
  ) {}

  @Mutation(() => MedicalSpecialties, { name: 'createMedicalSpecialty' })
  async create(@Args('input') input: CreateMedicalSpecialtyInput) {
    return await this.medicalSpecialtiesService.create(input);
  }

  @Query(() => MedicalSpecialties, { name: 'getMedicalSpecialtyById' })
  async getSpecialtyById(@Args('input') id: String) {
    return await this.medicalSpecialtiesService.findById(id);
  }

  @Mutation(() => MedicalSpecialties, { name: 'updateMedicalSpecialty' })
  async update(@Args('input') input: UpdateMedicalSpecialtyInput) {
    return await this.medicalSpecialtiesService.update(input);
  }

  @Mutation(() => MedicalSpecialties, { name: 'deleteMecialSpecialty' })
  async delete(@Args('id') id: String) {
    return await this.medicalSpecialtiesService.delete(id);
  }

  @Query(() => [MedicalSpecialties], { name: 'getAllMecialSpecialty' })
  async getAllMecialSpecialties(): Promise<MedicalSpecialties[]> {
    return this.medicalSpecialtiesService.getAll();
  }

  @Query(() => [MedicalSpecialties], { name: 'getMedicalSpecialtySelect' })
  async getMedicalSpecialtySelect(
    @Args('input') input: String,
  ): Promise<MedicalSpecialties[]> {
    return this.medicalSpecialtiesService.findByMedicalFacilityId(input);
  }

  @Query(() => [MedicalSpecialties], {
    name: 'getMedicalSpecialtiesByMedicalFacilityId',
  })
  async getMedicalSpecialtiesByMedicalFacilityId(
    @Args('input') id: String,
  ): Promise<MedicalSpecialties[]> {
    return this.medicalSpecialtiesService.getAllByMedicalFacilytyId(id);
  }

  @Query(() => [MedicalSpecialties], {
    name: 'getAllMedicalSpecialtiesOfFacility',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalSpecialtiesOfFacility(
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<MedicalSpecialties[]> {
    {
      if (userId !== '') {
        const facility = await this.facilityLoaderSrv.loadByUserId(userId);
        if (facility) {
          const docs =
            await this.medicalSpecialtiesService.getAllMedicalSpcialtyOfFacility(
              facility.id,
            );
          return docs;
        } else return null;
      } else {
        if (staffId !== '') {
          const staff = await this.staffSvr.findById(staffId);
          if (staff) {
            const docs =
              await this.medicalSpecialtiesService.getAllMedicalSpcialtyOfFacility(
                staff.medicalFacilityId,
              );
            return docs;
          } else return null;
        }
      }
    }
  }

  @Query(() => [MedicalSpecialties], {
    name: 'getAllMedicalSpecialtiesPaginationOfFacility',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalSpecialtiesPaginationOfFacility(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<MedicalSpecialties[]> {
    {
      if (userId !== '') {
        const facility = await this.facilitySvr.findOneByUserId(userId);
        if (facility) {
          const docs =
            await this.medicalSpecialtiesService.getAllMedicalSpcialtyPaginationOfFacility(
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
              await this.medicalSpecialtiesService.getAllMedicalSpcialtyPaginationOfFacility(
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

  @Query(() => [MedicalSpecialties], {
    name: 'getAllMedicalSpecialtiesPaginationOfFacilityForClient',
  })
  async getAllMedicalSpecialtiesPaginationOfFacilityForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('facilityId') facilityId: string,
  ): Promise<MedicalSpecialties[]> {
    {
      const docs =
        await this.medicalSpecialtiesService.getAllMedicalSpcialtyPaginationOfFacility(
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
  }

  @Query(() => [MedicalSpecialties], {
    name: 'getAllMedicalSpecialtiesPaginationByStaff',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalSpecialtiesPaginationByStaff(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('staffId') staffId: string,
  ): Promise<MedicalSpecialties[]> {
    {
      const staff = await this.staffSvr.findById(staffId);

      if (
        staff &&
        staff.permissions.includes(EPermission.ManagerSpecialty) &&
        staff.specialtyId.length > 0
      ) {
        const specialties =
          await this.medicalSpecialtiesService.getAllMedicalSpcialtyPaginationOfFacility(
            search,
            page,
            limit,
            sortField,
            sortOrder,
            staff.medicalFacilityId,
          );
        const specialtiesOfStaff = specialties.filter((specialty) =>
          staff.specialtyId.includes(specialty.id),
        );
        return specialtiesOfStaff;
      } else return null;
    }
  }

  @Query(() => Number, { name: 'getTotalMedicalSpecialtiesCount' })
  async getTotalMedicalSpecialtiesCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId?: string,
  ): Promise<number> {
    if (userId === '') {
      const count =
        await this.medicalSpecialtiesService.getTotalMedicalSpecialtyCount(
          search || '',
        );
      return count;
    } else {
      if (staffId !== '') {
        const staff = await this.staffSvr.findById(staffId);
        if (staff) {
          const count =
            await this.medicalSpecialtiesService.getTotalMedialSpecialtyCountOfFacility(
              search || '',
              staff.medicalFacilityId,
            );
          return count;
        } else return null;
      } else {
        const facility = await this.facilitySvr.findOneByUserId(userId);
        if (facility) {
          const count =
            await this.medicalSpecialtiesService.getTotalMedialSpecialtyCountOfFacility(
              search || '',
              facility.id,
            );
          return count;
        }
      }
      return null;
    }
  }

  @Query(() => Number, { name: 'getTotalMedicalSpecialtiesCountForClient' })
  async getTotalMedicalSpecialtiesCountForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('facilityId') facilityId: string,
  ): Promise<number> {
    const count =
      await this.medicalSpecialtiesService.getTotalMedialSpecialtyCountOfFacility(
        search || '',
        facilityId,
        true,
      );
    return count;
  }

  @ResolveField(() => MedicalFacilities, { name: 'facility' })
  async facility(
    @Parent() specialty: MedicalSpecialties,
  ): Promise<MedicalFacilities> {
    const data = await this.facilityLoaderSrv.load(
      specialty.medicalFactilityId,
    );
    return data;
  }

  @ResolveField(() => Number, { name: 'registerCount' })
  async registerCount(
    @Parent() p: MedicalSpecialties,
    @Args('startTime') startTime: string,
    @Args('endTime') endTime: string,
  ): Promise<number> {
    const count = this.registerSrv.regisSpecialtyCount(
      p.id,
      startTime,
      endTime,
    );
    return count;
  }
}
