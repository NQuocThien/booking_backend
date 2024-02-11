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
  async findById(id: String): Promise<MedicalFacilities> {
    return this.medicalModel.findById(id);
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

      console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }
}
