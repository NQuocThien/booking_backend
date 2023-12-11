import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MedicalFacilitiesService } from './medical-facilities.service';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { CreateMedicalFacilitiesInput } from './entities/dto/create-medical-facilities.input';
import { Doctor } from '../doctors/entities/docter.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/entities/role.enum';

@Resolver(() => MedicalFacilities)
export class MedicalFacilitiesResolver {
  constructor(
    private readonly medicalService: MedicalFacilitiesService,
    private readonly doctorService: DoctorsService,
  ) {}
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Query(() => [MedicalFacilities], { name: 'getMedicalfacilities' })
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

  @ResolveField(() => [Doctor])
  async doctors(@Parent() mf: MedicalFacilities): Promise<Doctor[]> {
    console.log('test');
    const docs = await this.doctorService.findByFacilitiesId(mf.id);
    // console.log('docs', docs.length);
    return docs.length === 0 ? null : docs;
  }
}
