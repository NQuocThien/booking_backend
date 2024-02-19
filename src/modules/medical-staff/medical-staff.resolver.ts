import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MedicalStaffService } from './medical-staff.service';
import { MedicalStaff } from './entities/medical-staff.entity';
import { CreateMedicalStaffInput } from './entities/dto/create-medical-staff.input';
import { UpdateMedicalStaffInput } from './entities/dto/update-medical-staff.input';

@Resolver()
export class MedicalStaffResolver {
  constructor(private readonly medicalStaffService: MedicalStaffService) {}

  @Query(() => [MedicalStaff], { name: 'getAllMedicalStaff' })
  async getAllMedicalStaff(): Promise<MedicalStaff[]> {
    return await this.medicalStaffService.getAllMedicalStaff();
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
}
