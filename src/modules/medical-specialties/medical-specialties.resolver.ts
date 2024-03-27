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
import { MedicalStaff } from '../medical-staff/entities/medical-staff.entity';

@Resolver(() => MedicalSpecialties)
export class MedicalSpecialtiesResolver {
  constructor(
    private readonly medicalSpecialtiesService: MedicalSpecialtiesService,
    private readonly facilitySvr: MedicalFacilitiesService,
    private readonly staffSvr: MedicalStaffService,
    private readonly facilityLoaderSrv: FacilitiesLoaderService,
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
      console.log('---> input staffId: ', staffId);
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

  @ResolveField(() => MedicalFacilities, { name: 'facility' })
  async facility(
    @Parent() specialty: MedicalSpecialties,
  ): Promise<MedicalFacilities> {
    console.log('Call medicalFactilityId:', specialty.medicalFactilityId);
    const data = await this.facilityLoaderSrv.load(
      specialty.medicalFactilityId,
    );
    return data;
  }
  // @ResolveField(() => MedicalStaff, { name: 'staff' })
  // async staff(@Parent() specialty: MedicalSpecialties): Promise<MedicalStaff> {
  //   console.log('Call medicalFactilityId:', specialty.medicalFactilityId);
  //   // const data = await this.facilitySvr.findById(specialty.medicalFactilityId);
  //   return;
  // }
}
