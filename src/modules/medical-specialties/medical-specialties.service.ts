import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMedicalSpecialtyInput } from './entities/dtos/create-medical-specialties.input';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { UpdateMedicalSpecialtyInput } from './entities/dtos/update-medical-specialties.input';
import { deleteDatePast } from 'src/utils/contain';
import { EStatusService } from 'src/contain';

@Injectable()
export class MedicalSpecialtiesService {
  constructor(
    @InjectModel(MedicalSpecialties.name)
    private readonly medicalSpecialtiesModel: Model<MedicalSpecialties>,
  ) {}
  async create(data: CreateMedicalSpecialtyInput) {
    return this.medicalSpecialtiesModel.create(data);
  }
  async findById(id: String) {
    let currSpecialty = await this.medicalSpecialtiesModel.findById(id);
    const dateOffs: [Date] = currSpecialty.workSchedule.dayOff;
    if (dateOffs.length > 0) {
      const removedPastDates: [Date] = deleteDatePast(dateOffs);
      if (removedPastDates !== dateOffs) {
        currSpecialty.workSchedule.dayOff = removedPastDates;
        const newSpecialty = await currSpecialty.save();
        return newSpecialty;
      }
      return currSpecialty;
    }
    return currSpecialty;
  }
  async findByIds(ids: string[]) {
    let currSpecialty = await this.medicalSpecialtiesModel.find({
      _id: { $in: ids },
    });
    return currSpecialty;
  }

  async findByMedicalFacilityId(
    medicalFacilityId: String,
  ): Promise<MedicalSpecialties[]> {
    return await this.medicalSpecialtiesModel.find({
      medicalFactilityId: medicalFacilityId,
    });
  }
  async delete(id: String) {
    return this.medicalSpecialtiesModel.findByIdAndDelete(id);
  }
  async update(data: UpdateMedicalSpecialtyInput) {
    try {
      const existingDoc = await this.medicalSpecialtiesModel.findById(data.id);
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
  async findOneById(id: String): Promise<MedicalSpecialties> {
    let currSpecialty = await this.medicalSpecialtiesModel.findById(id);
    return currSpecialty;
  }

  async getAll(): Promise<MedicalSpecialties[]> {
    return await this.medicalSpecialtiesModel.find();
  }
  async getAllByMedicalFacilytyId(
    medicalFactilityId: String,
  ): Promise<MedicalSpecialties[]> {
    return await this.medicalSpecialtiesModel.find({
      medicalFactilityId: medicalFactilityId,
    });
  }
  async getAllByIds(ids: String[]): Promise<MedicalSpecialties[]> {
    const result = await this.medicalSpecialtiesModel.find({
      _id: { $in: ids },
    });
    return result;
  }
  async getTotalSpacialtyCountByFacilityId(
    facilityId: string,
    isClient: boolean = false,
  ): Promise<number> {
    const query: any = { medicalFactilityId: facilityId };
    if (isClient) {
      query['workSchedule.status'] = EStatusService.Open;
    }
    const count = await this.medicalSpecialtiesModel.countDocuments(query);
    return count;
  }

  async getAllMedicalSpcialtyOfFacility(
    facilityId: string,
  ): Promise<MedicalSpecialties[]> {
    return this.medicalSpecialtiesModel
      .find({ medicalFactilityId: facilityId })
      .exec();
  }
  async getAllMedicalSpcialtyPaginationOfFacility(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    facilityId: string,
    isClient: boolean = false,
  ): Promise<MedicalSpecialties[]> {
    const query: any = { medicalFactilityId: facilityId };
    if (search) query.specialtyName = { $regex: search, $options: 'i' };
    if (isClient) query['workSchedule.status'] = EStatusService.Open;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;

    return this.medicalSpecialtiesModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .exec();
  }
  async getTotalMedicalSpecialtyCount(search: string): Promise<number> {
    const query = search
      ? { specialtyName: { $regex: new RegExp(search, 'i') } }
      : {};
    const count = await this.medicalSpecialtiesModel.countDocuments(query);
    return count;
  }
  async getTotalMedialSpecialtyCountOfFacility(
    search: string,
    facilityId: string,
    isClient: boolean = false,
  ): Promise<number> {
    const query: any = { medicalFactilityId: facilityId };
    if (search) query.specialtyName = { $regex: search, $options: 'i' };
    if (isClient) query['workSchedule.status'] = EStatusService.Open;
    const count = await this.medicalSpecialtiesModel.countDocuments(query);
    return count;
  }
}
