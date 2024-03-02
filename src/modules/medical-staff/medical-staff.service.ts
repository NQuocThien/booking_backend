import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalStaff } from './entities/medical-staff.entity';
import { Model } from 'mongoose';
import { CreateMedicalStaffInput } from './entities/dto/create-medical-staff.input';
import { UpdateMedicalStaffInput } from './entities/dto/update-medical-staff.input';

@Injectable()
export class MedicalStaffService {
  constructor(
    @InjectModel(MedicalStaff.name)
    private readonly model: Model<MedicalStaff>,
  ) {}

  async getAllMedicalStaff(): Promise<MedicalStaff[]> {
    return await this.model.find();
  }
  async createMedicalStaff(
    input: CreateMedicalStaffInput,
  ): Promise<MedicalStaff> {
    return await this.model.create(input);
  }
  async updateMedicalStaff(
    input: UpdateMedicalStaffInput,
  ): Promise<MedicalStaff> {
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
  async deleteMedicalStaff(id: String) {
    return await this.model.findByIdAndDelete(id);
  }
  async findByMedicalFacilityId(
    medicalFacilityId: String,
  ): Promise<MedicalStaff[]> {
    return await this.model.find({ medicalFacilityId: medicalFacilityId });
  }
}
