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
import { UpdateDoctorInput } from './entities/dtos/update-doctor.input';
import deleteImage from 'src/utils/delete_image';

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

  @Query(() => Doctor, { name: 'getDoctorbyId' })
  async getDoctorbyId(@Args('id') id: String): Promise<Doctor> {
    return this.doctorService.findOneById(id);
  }

  @Query(() => Doctor, { name: 'getDoctorbyUserId' })
  async getDoctorbyUserId(@Args('id') id: String): Promise<Doctor> {
    console.log('Test User ID: ', id);
    return this.doctorService.findOneByUserId(id);
  }

  @Mutation(() => Doctor, { name: 'createDoctor' })
  async createDoctor(@Args('createDoctorInput') data: CreateDoctorInput) {
    return await this.doctorService.create(data);
  }

  @Mutation(() => Doctor, { name: 'updateDoctor' })
  async updateDoctor(@Args('updateDoctorInput') data: UpdateDoctorInput) {
    try {
      const currDoctor = await this.doctorService.findOne(data.id);
      deleteImage(currDoctor.avatar);
    } catch (e) {
      console.log('Error Delete Image');
    }
    return await this.doctorService.updateById(data);
  }

  @Mutation(() => Doctor, { name: 'deleteDoctor' })
  async deleteDoctor(@Args('id') id: String): Promise<Doctor> {
    try {
      const currDoctor = await this.doctorService.findOne(id);
      deleteImage(currDoctor.avatar);
    } catch (e) {
      console.log('Error Delete Image');
    }
    return this.doctorService.delete(id);
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
