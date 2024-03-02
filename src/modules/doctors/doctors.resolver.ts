import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import { CreateDoctorInput } from './entities/dtos/create-doctor.input';
import { Doctor } from './entities/doctor.entity';
import { UpdateDoctorInput } from './entities/dtos/update-doctor.input';
import deleteImage from 'src/utils/delete_image';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';
import { MedicalSpecialties } from '../medical-specialties/entities/medical-specialties.entity';

@Resolver(() => Doctor)
export class DoctorsResolver {
  constructor(
    private readonly doctorService: DoctorsService,
    private readonly specialtySvr: MedicalSpecialtiesService,
  ) {}

  @Query(() => [Doctor], { name: 'getAllDoctor' })
  async getAllDoctor(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Query(() => Doctor, { name: 'getDoctorbyId' })
  async getDoctorbyId(@Args('id') id: String): Promise<Doctor> {
    return this.doctorService.findOneById(id);
  }

  @Query(() => Doctor, { name: 'getDoctorbyUserId' })
  async getDoctorbyUserId(@Args('id') id: String): Promise<Doctor> {
    return this.doctorService.findOneByUserId(id);
  }

  @Mutation(() => Doctor, { name: 'createDoctor' })
  async createDoctor(@Args('createDoctorInput') data: CreateDoctorInput) {
    return await this.doctorService.create(data);
  }

  @Mutation(() => Doctor, { name: 'updateDoctor' })
  async updateDoctor(@Args('input') data: UpdateDoctorInput) {
    try {
      const currDoctor = await this.doctorService.findOne(data.id);
      if (JSON.stringify(currDoctor.avatar) !== JSON.stringify(data.avatar))
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

  @ResolveField(() => MedicalSpecialties, { name: 'specialty' })
  async specialty(@Parent() doctor: Doctor): Promise<MedicalSpecialties> {
    if (doctor.specialistId === '') {
      return null;
    }
    return await this.specialtySvr.findOneById(doctor.specialistId);
  }
}
