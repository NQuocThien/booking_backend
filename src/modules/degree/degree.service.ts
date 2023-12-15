import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Degree } from './entities/degree.entity';
import { Model } from 'mongoose';
import { CreateDegreeInput } from './entities/dtos/create-degree.input';
import { UpdateDegreeInput } from './entities/dtos/update-degree.input';
import { error } from 'console';

@Injectable()
export class DegreeService {
  constructor(
    @InjectModel(Degree.name)
    private readonly degreeModel: Model<Degree>,
  ) {}
  async findOneById(id: string): Promise<Degree> {
    return this.degreeModel.findById(id);
  }
  async getAllDegree(): Promise<Degree[]> {
    return this.degreeModel.find();
  }

  async createDegree(data: CreateDegreeInput): Promise<Degree> {
    return this.degreeModel.create(data);
  }
  async delete(id: String): Promise<Degree> {
    return this.degreeModel.findByIdAndDelete(id);
  }

  async updateDegree(data: UpdateDegreeInput): Promise<Degree> {
    try {
      const existingDoc = await this.degreeModel.findById(data.id);
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
