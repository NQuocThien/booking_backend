import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TypePackage } from './entities/type-packed';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTypePackageInput } from './entities/dto/create-type-package.input';
import { UpdateTypePackageInput } from './entities/dto/update-type-package.input';

@Injectable()
export class TypePackageService {
  constructor(
    @InjectModel(TypePackage.name)
    private readonly model: Model<TypePackage>,
  ) {}
  async create(input: CreateTypePackageInput): Promise<TypePackage> {
    return await this.model.create(input);
  }
  async findAll(): Promise<TypePackage[]> {
    return await this.model.find();
  }
  async update(data: UpdateTypePackageInput): Promise<TypePackage> {
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
  async delete(id: String): Promise<TypePackage> {
    return await this.model.findByIdAndDelete(id);
  }
}
