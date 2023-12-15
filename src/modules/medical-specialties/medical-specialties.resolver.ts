import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { CreateMedicalSpecialtiesInput } from './entities/dtos/create-medical-specialties.input';
import { UpdateMedicalSpecialtiesInput } from './entities/dtos/update-medical-specialties.input';

@Resolver()
export class MedicalSpecialtiesResolver {
  constructor(
    private readonly medicalSpecialtiesService: MedicalSpecialtiesService,
  ) {}

  @Mutation(() => MedicalSpecialties, { name: 'createMecialSpecialties' })
  async create(
    @Args('mecicalSpecialtiesInput') input: CreateMedicalSpecialtiesInput,
  ) {
    return await this.medicalSpecialtiesService.create(input);
  }

  @Mutation(() => MedicalSpecialties, { name: 'updateMecialSpecialties' })
  async update(
    @Args('updateSpecialtiesInput') input: UpdateMedicalSpecialtiesInput,
  ) {
    return await this.medicalSpecialtiesService.update(input);
  }

  @Mutation(() => MedicalSpecialties, { name: 'deleteMecialSpecialties' })
  async delete(@Args('id') id: String) {
    return await this.medicalSpecialtiesService.delete(id);
  }

  @Query(() => [MedicalSpecialties], { name: 'getAllMecialSpecialties' })
  async getAllMecialSpecialties(): Promise<MedicalSpecialties[]> {
    return this.medicalSpecialtiesService.getAll();
  }
}
