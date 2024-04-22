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
import { MedicalFacilitiesService } from '../medical-facilities/medical-facilities.service';
import { FilterDoctorInput } from './entities/dtos/filter-doctor.input';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
import { MedicalFacilities } from '../medical-facilities/entities/mecical-facilies.entity';
import { RegisterService } from '../register/register.service';
import { FacilitiesLoaderService } from '../medical-facilities/facility-loader';

@Resolver(() => Doctor)
export class DoctorsResolver {
  constructor(
    private readonly doctorService: DoctorsService,
    private readonly specialtySvr: MedicalSpecialtiesService,
    private readonly facilitySvr: MedicalFacilitiesService,
    private readonly facilityLoaderSvr: FacilitiesLoaderService,
    private readonly staffSvr: MedicalStaffService,
    private readonly registerSrv: RegisterService,
  ) {}

  @Query(() => [Doctor], { name: 'getAllDoctor' })
  async getAllDoctor(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Query(() => Number, { name: 'getTotalDoctorsCount' })
  async getTotalDoctorsCount(
    @Args('filter', { nullable: true }) filter: FilterDoctorInput,
    @Args('userId', { nullable: true, defaultValue: '' }) userId?: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId?: string,
  ): Promise<number> {
    if (userId === '') {
      if (staffId !== '') {
        const staff = await this.staffSvr.findById(staffId);
        if (staff) {
          const count = await this.doctorService.getTotalDoctorsCountOfFacility(
            filter,
            staff.medicalFacilityId,
          );
          return count;
        } else return null;
      } else {
        const count = await this.doctorService.getTotalDoctorsCount(filter);
        return count;
      }
    } else {
      const facility = await this.facilitySvr.findOneByUserId(userId);
      if (facility) {
        const count = await this.doctorService.getTotalDoctorsCountOfFacility(
          filter,
          facility.id,
        );
        return count;
      }
      return null;
    }
  }

  @Query(() => Number, { name: 'getTotalDoctorsCountForClient' })
  async getTotalDoctorsCountForClient(
    @Args('filter', { nullable: true }) filter: FilterDoctorInput,
    @Args('facilityId') facilityId?: string,
  ): Promise<number> {
    const count = await this.doctorService.getTotalDoctorsCountOfFacility(
      filter,
      facilityId,
    );
    return count;
  }

  @Query(() => [Doctor], { name: 'getAllDoctorPagination' })
  async getAllDoctorPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'doctorName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
  ): Promise<Doctor[]> {
    {
      const user = await this.doctorService.getAllDoctorPagination(
        search,
        page,
        limit,
        sortField,
        sortOrder,
      );
      return user;
    }
  }
  @Query(() => [Doctor], { name: 'getAllDoctorOfFacility' })
  // @UseGuards(JWtAuthGuard)
  async getAllDoctorOfFacility(
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<Doctor[]> {
    {
      if (userId !== '') {
        const facility = await this.facilityLoaderSvr.loadByUserId(userId);
        if (facility) {
          const docs = await this.doctorService.getAllDoctorOfFacility(
            facility.id,
          );
          return docs;
        } else return null;
      } else {
        if (staffId !== '') {
          const staff = await this.staffSvr.findById(staffId);
          if (staff) {
            const docs = await this.doctorService.getAllDoctorOfFacility(
              staff.medicalFacilityId,
            );
            return docs;
          } else return null;
        }
      }
    }
  }
  @Query(() => [Doctor], { name: 'getAllDoctorPaginationOfFacility' })
  // @UseGuards(JWtAuthGuard)
  async getAllDoctorPaginationOfFacility(
    @Args('filter', { nullable: true }) filter: FilterDoctorInput,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('userId', { nullable: true, defaultValue: '' }) userId: string,
    @Args('staffId', { nullable: true, defaultValue: '' }) staffId: string,
  ): Promise<Doctor[]> {
    {
      if (userId !== '') {
        const facility = await this.facilitySvr.findOneByUserId(userId);
        if (facility) {
          const docs =
            await this.doctorService.getAllDoctorPaginationOfFacility(
              filter,
              page,
              limit,
              sortField,
              sortOrder,
              facility.id,
            );
          return docs;
        } else return null;
      } else {
        if (staffId !== '') {
          const staff = await this.staffSvr.findById(staffId);
          if (staff) {
            const docs =
              await this.doctorService.getAllDoctorPaginationOfFacility(
                filter,
                page,
                limit,
                sortField,
                sortOrder,
                staff.medicalFacilityId,
              );
            return docs;
          } else return null;
        }
      }
    }
  }
  @Query(() => [Doctor], { name: 'getAllDoctorPaginationOfFacilityForClient' })
  // @UseGuards(JWtAuthGuard)
  async getAllDoctorPaginationOfFacilityForClient(
    @Args('filter', { nullable: true }) filter: FilterDoctorInput,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'doctorName' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
    @Args('facilityId') facilityId: string,
  ): Promise<Doctor[]> {
    {
      const docs = await this.doctorService.getAllDoctorPaginationOfFacility(
        filter,
        page,
        limit,
        sortField,
        sortOrder,
        facilityId,
        true,
      );
      return docs;
    }
  }

  @Query(() => [Doctor], { name: 'getAllDoctorByFacilityId' })
  async getAllDoctorByFacilityId(
    @Args('input') input: String,
  ): Promise<Doctor[]> {
    return this.doctorService.findByFacilitiesId(input);
  }

  @Query(() => [Doctor], { name: 'getAllDoctorPending' })
  async getAllDoctorPending(): Promise<Doctor[]> {
    const allDoctor = await this.doctorService.findAll();
    const doctorsPending = allDoctor.filter(
      (doc) => doc.medicalFactilitiesId === '',
    );
    return doctorsPending;
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
      const compare: boolean =
        JSON.stringify(currDoctor.avatar) !== JSON.stringify(data.avatar);
      console.log('---> Delete old image:', compare);
      if (compare) deleteImage(currDoctor.avatar, 'doctors');
    } catch (e) {
      console.log('Error Delete Image');
    }
    return await this.doctorService.updateById(data);
  }

  @Mutation(() => Doctor, { name: 'deleteDoctor' })
  async deleteDoctor(@Args('id') id: String): Promise<Doctor> {
    try {
      const currDoctor = await this.doctorService.findOne(id);
      deleteImage(currDoctor.avatar, 'doctors');
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

  @ResolveField(() => MedicalFacilities, { name: 'facility' })
  async facility(@Parent() doctor: Doctor): Promise<MedicalFacilities> {
    if (doctor.specialistId === '') {
      return null;
    }
    return await this.facilitySvr.findById(doctor.medicalFactilitiesId);
  }

  @ResolveField(() => Number, { name: 'registerCount' })
  async registerCount(
    @Parent() doctor: Doctor,
    @Args('startTime') startTime: string,
    @Args('endTime') endTime: string,
  ): Promise<number> {
    const count = this.registerSrv.regisDoctorCount(
      doctor.id,
      startTime,
      endTime,
    );
    return count;
  }
}
