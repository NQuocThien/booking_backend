import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { MedicalFacilitiesService } from './medical-facilities.service';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { CreateMedicalFacilitiesInput } from './entities/dto/create-medical-facilities.input';

@Resolver()
export class MedicalFacilitiesResolver {
  constructor(private readonly medicalService: MedicalFacilitiesService) {}

  @Query(() => [MedicalFacilities], { name: 'medicalfacilities' })
  async medicalFacilities(): Promise<MedicalFacilities[]> {
    return await this.medicalService.findAll();
  }

  @Mutation(() => MedicalFacilities, { name: 'createMedicalFacilities' })
  async createMedicalFacilities(
    @Args('createMedicalFacilitiesInput')
    createMedicalFacilitiesInput: CreateMedicalFacilitiesInput,
  ): Promise<MedicalFacilities> {
    return await this.medicalService.createMedicalFacilities(
      createMedicalFacilitiesInput,
    );
  }
}
