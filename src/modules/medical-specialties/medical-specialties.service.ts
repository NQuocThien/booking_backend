import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMedicalSpecialtyInput } from './entities/dtos/create-medical-specialties.input';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { UpdateMedicalSpecialtyInput } from './entities/dtos/update-medical-specialties.input';

@Injectable()
export class MedicalSpecialtiesService {
  constructor(
    @InjectModel(MedicalSpecialties.name)
    private readonly medicalSpecialtiesModel: Model<MedicalSpecialties>,
  ) {}
  async create(data: CreateMedicalSpecialtyInput) {
    return this.medicalSpecialtiesModel.create(data);
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
  async findOneById(id: String): Promise<MedicalSpecialties> {
    return await this.medicalSpecialtiesModel.findById(id);
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
}
