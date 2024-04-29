import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorInput } from './entities/dtos/create-doctor.input';
import { UpdateDoctorInput } from './entities/dtos/update-doctor.input';
import { deleteDatePast } from 'src/utils/contain';
import { EStatusService } from 'src/contain';
import { FilterDoctorInput } from './entities/dtos/filter-doctor.input';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
  ) {}
  async findOne(id: String): Promise<Doctor> {
    return this.doctorModel.findById(id);
  }
  async delete(id: String): Promise<Doctor> {
    return this.doctorModel.findByIdAndDelete(id);
  }

  async create(data: CreateDoctorInput) {
    return await this.doctorModel.create(data);
  }

  async getIdsByfacilityId(facilityIds: string) {
    const ids: Doctor[] = await this.doctorModel.find({
      medicalFactilitiesId: { $eq: facilityIds },
    });
    return ids;
  }

  async updateById(data: UpdateDoctorInput) {
    try {
      const existingDoc = await this.doctorModel.findById(data.id);
      if (!existingDoc) {
        return null;
      }
      Object.assign(existingDoc, data);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      return null;
    }
  }
  async findAll() {
    return await this.doctorModel.find();
  }
  async findAllUserIds(facilityId: string) {
    const arr = await this.doctorModel
      .find({ medicalFactilitiesId: facilityId }, 'userId')
      .exec();
    const userIds: string[] = arr.map((s) => s.userId as string);
    return userIds;
  }
  async getAllDoctorPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
  ): Promise<Doctor[]> {
    const query = search
      ? { doctorName: { $regex: search, $options: 'i' } }
      : {};
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.doctorModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }
  async getAllDoctorPaginationOfFacility(
    filter: FilterDoctorInput,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    facilityId: string,
    isClient: boolean = false,
  ): Promise<Doctor[]> {
    const query = this.renderQueryOfFacility(filter, facilityId, isClient);
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.doctorModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .exec();
  }
  async getAllDoctorOfFacility(facilityId: string): Promise<Doctor[]> {
    return this.doctorModel
      .find({
        medicalFactilitiesId: facilityId,
      })
      .exec();
  }

  async getTotalDoctorsCount(filter: FilterDoctorInput): Promise<number> {
    const query = this.renderQuery(filter);
    const count = await this.doctorModel.countDocuments(query);
    return count;
  }
  async getTotalDoctorsCountOfFacility(
    filter: FilterDoctorInput,
    facilityId: string,
  ): Promise<number> {
    const query = this.renderQueryOfFacility(filter, facilityId);
    const count = await this.doctorModel.countDocuments(query);
    return count;
  }
  async findByIds(ids: string[]) {
    let res = await this.doctorModel.find({ _id: { $in: ids } });
    return res;
  }
  async findOneById(id: String) {
    let currDoctor = await this.doctorModel.findById(id);
    const dateOffs: [Date] = currDoctor.workSchedule.dayOff;
    if (dateOffs.length > 0) {
      const removedPastDates: [Date] = deleteDatePast(dateOffs);
      if (removedPastDates !== dateOffs) {
        currDoctor.workSchedule.dayOff = removedPastDates;
        const newDoctor = await currDoctor.save();
        return newDoctor;
      }
      return currDoctor;
    }
    return currDoctor;
  }
  async findOneByUserId(userId: String) {
    return await this.doctorModel.findOne({ userId: userId });
  }
  async findOneByDegreeId(degreeId: String) {
    return await this.doctorModel.findOne({ degreeId: degreeId });
  }
  async findByFacilitiesId(id: String): Promise<Doctor[]> {
    return await this.doctorModel.find({ medicalFactilitiesId: id });
  }
  async getTotalPackagesCountByFacilityId(
    facilityId: string,
    isClient: boolean = false,
  ): Promise<number> {
    const query: any = { medicalFactilitiesId: facilityId };
    if (isClient) {
      query['workSchedule.status'] = EStatusService.Open;
    }
    const count = await this.doctorModel.countDocuments(query);
    return count;
  }
  renderQuery(
    filter: FilterDoctorInput,
    facilityId: string = undefined,
    isClient: boolean = false,
  ): any {
    const query: any = {};

    if (facilityId) {
      query.medicalFactilitiesId = facilityId;
    }
    if (filter?.doctorName) {
      query.doctorName = { $regex: filter.doctorName, $options: 'i' };
    }

    if (filter?.degree) {
      query.degree = filter.degree;
    }

    if (filter?.academicTitle) {
      query.academicTitle = filter.academicTitle;
    }

    if (filter?.gender) {
      query.gender = filter.gender;
    }

    if (isClient) {
      query['workSchedule.status'] = EStatusService.Open;
    }
    return query;
  }
  renderQueryOfFacility(
    filter: FilterDoctorInput,
    facilityId: string,
    isClient: boolean = false,
  ): any {
    // console.log('filter', filter);
    const query: any = {};

    {
      query.medicalFactilitiesId = facilityId;
    }
    if (filter?.doctorName) {
      query.doctorName = { $regex: filter.doctorName, $options: 'i' };
    }

    if (filter?.specialistId) {
      query.specialistId = { $regex: filter.specialistId, $options: 'i' };
    }

    if (filter?.degree) {
      query.degree = filter.degree;
    }

    if (filter?.academicTitle) {
      query.academicTitle = filter.academicTitle;
    }

    if (filter?.gender) {
      query.gender = filter.gender;
    }

    if (isClient) {
      query['workSchedule.status'] = EStatusService.Open;
    }
    return query;
  }
}
