import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { CreateMedicalSpecialtyInput } from './entities/dtos/create-medical-specialties.input';
import { UpdateMedicalSpecialtyInput } from './entities/dtos/update-medical-specialties.input';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';

@Resolver()
export class MedicalSpecialtiesResolver {
  constructor(
    private readonly medicalSpecialtiesService: MedicalSpecialtiesService,
    private readonly facilitySvr: MedicalFacilitiesService,
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
    @Args('userId', { nullable: true }) userId: string,
  ): Promise<MedicalSpecialties[]> {
    {
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
    }
  }

  @Query(() => Number, { name: 'getTotalMedicalSpecialtiesCount' })
  async getTotalMedicalSpecialtiesCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
  ): Promise<number> {
    if (userId === '') {
      const count =
        await this.medicalSpecialtiesService.getTotalMedicalSpecialtyCount(
          search || '',
        );
      return count;
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
      return null;
    }
  }
}
