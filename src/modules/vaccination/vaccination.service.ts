import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vaccination } from './entities/Vaccination.entity';
import { CreateVaccineInput } from './entities/dto/create-vaccination.input';
import { UpdateVaccineInput } from './entities/dto/update-vaccination.input';
import { deleteDatePast } from 'src/utils/contain';
import { EStatusService } from 'src/contain';
@Injectable()
export class VaccinationService {
  constructor(
    @InjectModel(Vaccination.name)
    private readonly model: Model<Vaccination>,
  ) {}

  async getAllVaccination(): Promise<Vaccination[]> {
    return await this.model.find();
  }

  async getAllVaccinationPaginationOfFacility(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    facilityId: string,
    isClient: boolean = false,
  ): Promise<Vaccination[]> {
    const query: any = { medicalFactilitiesId: facilityId };
    if (search) query.vaccineName = { $regex: search, $options: 'i' };7
    if (isClient) query['workSchedule.status'] = EStatusService.Open;

    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.model
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .exec();
  }
  async getTotalVaccinationsCount(search: string): Promise<number> {
    const query = search
      ? { vaccineName: { $regex: new RegExp(search, 'i') } }
      : {};
    const count = await this.model.countDocuments(query);
    return count;
  }
  async getTotalVaccinationsCountOfFacility(
    search: string,
    facilityId: string,
    isClient: boolean = false,
  ): Promise<number> {
    const query: any = { medicalFactilitiesId: facilityId };
    if (search) query.vaccineName = { $regex: search, $options: 'i' };
    if (isClient) query['workSchedule.status'] = EStatusService.Open;
    const count = await this.model.countDocuments(query);
    return count;
  }
  async findById(id: String): Promise<Vaccination> {
    let currVaccine = await this.model.findById(id);
    const dateOffs: [Date] = currVaccine.workSchedule.dayOff;
    if (dateOffs.length > 0) {
      const removedPastDates: [Date] = deleteDatePast(dateOffs);
      if (removedPastDates !== dateOffs) {
        currVaccine.workSchedule.dayOff = removedPastDates;
        const newVaccine = await currVaccine.save();
        return newVaccine;
      }
      return currVaccine;
    }
    return currVaccine;
  }
  async findByIds(ids: string[]): Promise<Vaccination[]> {
    let res = await this.model.find({ _id: { $in: ids } });
    return res;
  }

  async findByMedicalFacilityId(
    medicalFacilityId: String,
  ): Promise<Vaccination[]> {
    return await this.model.find({ medicalFactilitiesId: medicalFacilityId });
  }
  async create(input: CreateVaccineInput): Promise<Vaccination> {
    return await this.model.create(input);
  }
  async update(input: UpdateVaccineInput): Promise<Vaccination> {
    try {
      const existingDoc = await this.model.findById(input.id);
      if (!existingDoc) {
        return null;
      }
      Object.assign(existingDoc, input);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      return null;
    }
  }
  async delete(id: String): Promise<Vaccination> {
    return this.model.findByIdAndDelete(id);
  }
  async getTotalPackagesCountByFacilityId(
    facilityId: string,
    isClient: boolean = false,
  ): Promise<number> {
    const query: any = { medicalFactilitiesId: facilityId };
    if (isClient) {
      query['workSchedule.status'] = EStatusService.Open;
    }
    const count = await this.model.countDocuments(query);
    return count;
  }
}
