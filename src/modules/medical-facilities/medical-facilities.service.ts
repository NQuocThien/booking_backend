import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { Model } from 'mongoose';
import { CreateMedicalFacilityInput } from './entities/dto/create-medical-facilities.input';
import { UpdateMedicalFacilityInput } from './entities/dto/update-medical-facilities.input';

@Injectable()
export class MedicalFacilitiesService {
  constructor(
    @InjectModel(MedicalFacilities.name)
    private readonly medicalModel: Model<MedicalFacilities>,
  ) {}

  async findMedicalFacilitiesByUserId(
    userId: String,
  ): Promise<MedicalFacilities> {
    return this.medicalModel.findOne({ userId: userId });
  }
  async findAll(): Promise<MedicalFacilities[]> {
    return this.medicalModel.find();
  }
  async findUserIds(): Promise<{ userId: string }[]> {
    return this.medicalModel.find({}, { userId: 1, _id: 0 });
  }
  async findById(id: String): Promise<MedicalFacilities> {
    return this.medicalModel.findById(id);
  }
  async getTotalFacilitiesCount(search: string): Promise<number> {
    const query = search
      ? { medicalFacilityName: { $regex: new RegExp(search, 'i') } }
      : {};
    const count = await this.medicalModel.countDocuments(query);
    return count;
  }
  async getAllMedicalFacilityPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
  ): Promise<MedicalFacilities[]> {
    const query = search
      ? { medicalFacilityName: { $regex: search, $options: 'i' } }
      : {};
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.medicalModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }

  async findOneByUserId(id: String): Promise<MedicalFacilities> {
    return this.medicalModel.findOne({ userId: id });
  }
  async createMedicalFacility(
    data: CreateMedicalFacilityInput,
  ): Promise<MedicalFacilities> {
    return await this.medicalModel.create(data);
  }
  async updateMedicalFacilities(
    data: UpdateMedicalFacilityInput,
  ): Promise<MedicalFacilities> {
    try {
      const existingDoc = await this.medicalModel.findById(data.id);

      if (!existingDoc) {
        console.log('Document not found for ID:', data.id);
        return null;
      }

      // Cập nhật dữ liệu từ input vào existingDoc
      Object.assign(existingDoc, data);

      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();

      // console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }
  async delete(id: String): Promise<MedicalFacilities> {
    return await this.medicalModel.findByIdAndDelete(id);
  }
}
