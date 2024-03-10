import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vaccination } from './entities/Vaccination.entity';
import { CreateVaccineInput } from './entities/dto/create-vaccination.input';
import { UpdateVaccineInput } from './entities/dto/update-vaccination.input';
import { deleteDatePast } from 'src/utils/contain';
@Injectable()
export class VaccinationService {
  constructor(
    @InjectModel(Vaccination.name)
    private readonly model: Model<Vaccination>,
  ) {}

  async getAllVaccination(): Promise<Vaccination[]> {
    return await this.model.find();
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
        // console.log('Document not found for ID:', input.id);
        return null;
      }
      // Cập nhật dữ liệu từ input vào existingDoc
      Object.assign(existingDoc, input);
      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();
      // console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      // console.error('Error updating document:', error);
      return null;
    }
  }
  async delete(id: String): Promise<Vaccination> {
    return this.model.findByIdAndDelete(id);
  }
  async getTotalPackagesCountByFacilityId(facilityId: string): Promise<number> {
    const count = await this.model.countDocuments({
      medicalFactilitiesId: facilityId,
    });
    return count;
  }
}
