import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MedicalStaffService } from './medical-staff.service';
import { MedicalStaff } from './entities/medical-staff.entity';
import { CreateMedicalStaffInput } from './entities/dto/create-medical-staff.input';
import { UpdateMedicalStaffInput } from './entities/dto/update-medical-staff.input';
import { MedicalSpecialties } from '../medical-specialties/entities/medical-specialties.entity';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';

@Resolver(() => MedicalStaff)
export class MedicalStaffResolver {
  constructor(
    private readonly medicalStaffService: MedicalStaffService,
    private readonly specialtySrv: MedicalSpecialtiesService,
    private readonly facilitySvr: MedicalFacilitiesService,
  ) {}

  @Query(() => [MedicalStaff], { name: 'getAllMedicalStaff' })
  async getAllMedicalStaff(): Promise<MedicalStaff[]> {
    return await this.medicalStaffService.getAllMedicalStaff();
  }

  @Query(() => MedicalStaff, { name: 'getMedicalStaffById' })
  async getMedicalStaffById(
    @Args('input') input: String,
  ): Promise<MedicalStaff> {
    return await this.medicalStaffService.findById(input);
  }

  @Query(() => MedicalStaff, { name: 'getMedicalStaffByUserId' })
  async getMedicalStaffByUserId(
    @Args('input') input: String,
  ): Promise<MedicalStaff> {
    // console.log('----> userid: ', input);
    return await this.medicalStaffService.findByUserId(input);
  }

  @Query(() => [MedicalStaff], { name: 'getMedicalStaffByFacilityId' })
  async getMedicalStaffByFacilityId(
    @Args('input') id: String,
  ): Promise<MedicalStaff[]> {
    return await this.medicalStaffService.findByMedicalFacilityId(id);
  }

  // @Query(() => Number, { name: 'totalStaffsCount' })
  // async totalStaffsCount(
  //   @Args('search', { nullable: true }) search?: string,
  // ): Promise<number> {
  //   const count = await this.medicalStaffService.getTotalStaffCount(
  //     search || '',
  //   );
  //   return count;
  // }

  @Query(() => [MedicalStaff], { name: 'getAllStaffPagination' })
  // @UseGuards(JWtAuthGuard)
  async getAllStaffPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
  ): Promise<MedicalStaff[]> {
    {
      const user = await this.medicalStaffService.getAllStaffPagination(
        search,
        page,
        limit,
        sortField,
        sortOrder,
      );
      return user;
    }
  }

  @Mutation(() => MedicalStaff, { name: 'createMedicalStaff' })
  async createMedicalStaff(
    @Args('input') input: CreateMedicalStaffInput,
  ): Promise<MedicalStaff> {
    return await this.medicalStaffService.createMedicalStaff(input);
  }

  @Mutation(() => MedicalStaff, { name: 'updateMedicalStaff' })
  async updateMedicalStaff(
    @Args('input') input: UpdateMedicalStaffInput,
  ): Promise<MedicalStaff> {
    return await this.medicalStaffService.updateMedicalStaff(input);
  }

  @Mutation(() => MedicalStaff, { name: 'deleteMedicalStaff' })
  async deleteMedicalStaff(@Args('input') id: String): Promise<MedicalStaff> {
    return await this.medicalStaffService.deleteMedicalStaff(id);
  }

  @Query(() => [MedicalStaff], {
    name: 'getAllMedicalStaffPaginationOfFacility',
  })
  // @UseGuards(JWtAuthGuard)
  async getAllMedicalStaffPaginationOfFacility(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true }) userId: string,
  ): Promise<MedicalStaff[]> {
    {
      const facility = await this.facilitySvr.findOneByUserId(userId);
      if (facility) {
        const docs =
          await this.medicalStaffService.getAllMedicalStaffPaginationOfFacility(
            search,
            page,
            limit,
            sortField,
            sortOrder,
            facility.id,
          );
        return docs;
      } else return null;
    }
  }

  @Query(() => Number, { name: 'totalStaffsCount' })
  async totalStaffsCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
  ): Promise<number> {
    if (userId === '') {
      const count = await this.medicalStaffService.getTotalStaffCount(
        search || '',
      );
      return count;
    } else {
      const facility = await this.facilitySvr.findOneByUserId(userId);
      if (facility) {
        const count =
          await this.medicalStaffService.getTotalStaffCountOfFacility(
            search || '',
            facility.id,
          );
        return count;
      }
      return null;
    }
  }

  @ResolveField(() => [MedicalSpecialties], { name: 'specialties' })
  async specialties(@Parent() staff): Promise<MedicalSpecialties[]> {
    if (staff.specialtyId.length > 0)
      return await this.specialtySrv.getAllByIds(staff.specialtyId);
    return null;
  }
}
