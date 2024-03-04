import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationService } from './vaccination.service';
import { CreateVaccineInput } from './entities/dto/create-vaccination.input';
import { UpdateVaccineInput } from './entities/dto/update-vaccination.input';

@Resolver(() => Vaccination)
export class VaccinationResolver {
  constructor(private readonly vaccinationService: VaccinationService) {}

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
