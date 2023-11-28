import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { CreateMedicalSpecialtiesInput } from './entities/dtos/create-medical-specialties.input';

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
}
