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
import { UpdateMedicalFacilitiesInput } from './entities/dto/update-medical-facilities.input';
import { CarePackageService } from '../care-package/care-package.service';
import { CarePackage } from '../care-package/entities/care-package.entity';

@Resolver(() => MedicalFacilities)
export class MedicalFacilitiesResolver {
  constructor(
    private readonly medicalService: MedicalFacilitiesService,
    private readonly doctorService: DoctorsService,
    private readonly packageService: CarePackageService,
  ) {}
  // @UseGuards(JWtAuthGuard, RolesGuard)
  @Query(() => [MedicalFacilities], { name: 'getMedicalfacilities' })
  async medicalFacilities(): Promise<MedicalFacilities[]> {
    return await this.medicalService.findAll();
  }

  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Clinic)
  @Query(() => MedicalFacilities, { name: 'getClinicByUserId' })
  async getClinicByUserId(@Args('id') id: String): Promise<MedicalFacilities> {
    const result = await this.medicalService.findOneByUserId(id);
    return result;
  }

  @Query(() => MedicalFacilities, { name: 'getClinicById' })
  async getClinicById(@Args('id') id: String): Promise<MedicalFacilities> {
    const result = await this.medicalService.findById(id);
    return result;
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

  @Mutation(() => MedicalFacilities, { name: 'updateMedicalFacilities' })
  async updateMedicalFacilities(
    @Args('createMedicalFacilitiesInput')
    input: UpdateMedicalFacilitiesInput,
  ): Promise<MedicalFacilities> {
    return await this.medicalService.updateMedicalFacilities(input);
  }

  @ResolveField(() => [Doctor])
  async doctors(@Parent() mf: MedicalFacilities): Promise<Doctor[]> {
    const docs = await this.doctorService.findByFacilitiesId(mf.id);
    return docs;
  }

  @ResolveField(() => [CarePackage], { name: 'carePackage' })
  async carePackage(@Parent() mf: MedicalFacilities): Promise<CarePackage[]> {
    // console.log('test');
    const docs = await this.packageService.getByFacilitiesId(mf.id);
    return docs;
  }
}
