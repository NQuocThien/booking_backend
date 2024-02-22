import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { CreateMedicalSpecialtyInput } from './entities/dtos/create-medical-specialties.input';
import { UpdateMedicalSpecialtyInput } from './entities/dtos/update-medical-specialties.input';

@Resolver()
export class MedicalSpecialtiesResolver {
  constructor(
    private readonly medicalSpecialtiesService: MedicalSpecialtiesService,
  ) {}

  @Mutation(() => MedicalSpecialties, { name: 'createMedicalSpecialty' })
  async create(@Args('input') input: CreateMedicalSpecialtyInput) {
    return await this.medicalSpecialtiesService.create(input);
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
    console.log('getAllMecialSpecial');
    return this.medicalSpecialtiesService.getAll();
  }

  @Query(() => [MedicalSpecialties], {
    name: 'getMecialSpecialtiesByMedicalFacilityId',
  })
  async getMecialSpecialtiesByMedicalFacilityId(
    @Args('id') id: String,
  ): Promise<MedicalSpecialties[]> {
    console.log('getAllMecialSpecial');
    return this.medicalSpecialtiesService.getAllByMedicalFacilytyId(id);
  }
}
