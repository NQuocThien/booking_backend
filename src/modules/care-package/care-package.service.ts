import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CarePackage } from './entities/care-package.entity';
import { Model } from 'mongoose';
import { createCarePackageInput } from './entities/dto/create-care-package.input';
import { UpdateCarePackageInput } from './entities/dto/update-care-package.input';

@Injectable()
export class CarePackageService {
  constructor(
    @InjectModel(CarePackage.name)
    private readonly model: Model<CarePackage>,
  ) {}
  async create(input: createCarePackageInput): Promise<CarePackage> {
    return this.model.create(input);
  }
  async findByClinicId(id: String): Promise<CarePackage[]> {
    return this.model.find({ medicalFacilitiesId: id });
  }
  async finById(id: String): Promise<CarePackage> {
    return this.model.findById(id);
  }
  async delete(id: String): Promise<CarePackage> {
    return this.model.findByIdAndRemove(id);
  }
  async getByFacilitiesId(id: String): Promise<CarePackage[]> {
    return this.model.find({ medicalFacilitiesId: id });
  }
  async update(data: UpdateCarePackageInput): Promise<CarePackage> {
    try {
      const existingDoc = await this.model.findById(data.id);
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
  async findOneByTypeId(id: String): Promise<CarePackage[]> {
    return this.model.find({ typePackageId: id });
  }
}
