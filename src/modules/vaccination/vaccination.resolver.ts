import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationService } from './vaccination.service';
import { CreateVaccineInput } from './entities/dto/create-vaccination.input';
import { UpdateVaccineInput } from './entities/dto/update-vaccination.input';
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';

@Resolver(() => Vaccination)
export class VaccinationResolver {
  constructor(
    private readonly vaccinationService: VaccinationService,
    private readonly facilitySvr: MedicalFacilitiesService,
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
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true }) userId: string,
  ): Promise<Vaccination[]> {
    {
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
    }
  }

  @Query(() => Number, { name: 'getTotalVaccinationsCount' })
  async getTotalVaccinationsCount(
    @Args('search', { nullable: true }) search?: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
  ): Promise<number> {
    if (userId === '') {
      const count = await this.vaccinationService.getTotalVaccinationsCount(
        search || '',
      );
      return count;
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
  @Mutation(() => Vaccination, { name: 'createVaccination' })
  async createVaccination(
    @Args('input') input: CreateVaccineInput,
  ): Promise<Vaccination> {
    // console.log('createVaccination');
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
}
