import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import { CreateDoctorInput } from './entities/dtos/create-doctor.input';
import { Doctor } from './entities/docter.entity';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';
import { MedicalSpecialties } from '../medical-specialties/entities/medical-specialties.entity';
import { DegreeService } from '../degree/degree.service';

@Resolver(() => Doctor)
export class DoctorsResolver {
  constructor(
    private readonly doctorService: DoctorsService,
    private readonly specialtiesService: MedicalSpecialtiesService,
    private readonly degreeService: DegreeService,
  ) {}

  @Query(() => [Doctor], { name: 'getDoctors' })
  async getDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Mutation(() => Doctor, { name: 'createDoctor' })
  async createDoctor(@Args('createDoctorInput') data: CreateDoctorInput) {
    return await this.doctorService.create(data);
  }

  @ResolveField(() => MedicalSpecialties)
  async medicalSpecialties(@Parent() doctor: Doctor) {
    return this.specialtiesService.findOneById(doctor.idSpecialist);
  }

  @ResolveField(() => MedicalSpecialties, { name: 'degree' })
  async degree(@Parent() doctor: Doctor) {
    return this.degreeService.findOneById(doctor.degreeId);
  }
}
