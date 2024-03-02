import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluate } from './entities/evaluate.entity';
import { Model } from 'mongoose';
import { CreateEvaluateInput } from './entities/dto/create-evaluate.input';
import { UpdateEvaluateInput } from './entities/dto/update-evaluate.input';

@Injectable()
export class EvaluateService {
  constructor(
    @InjectModel(Evaluate.name)
    private readonly doctorModel: Model<Evaluate>,
  ) {}

  async findOneById(id: String): Promise<Evaluate> {
    return this.doctorModel.findById(id);
  }

  async delete(id: String): Promise<Evaluate> {
    return this.doctorModel.findByIdAndDelete(id);
  }

  async create(data: CreateEvaluateInput) {
    return await this.doctorModel.create(data);
  }
  async updateById(data: UpdateEvaluateInput) {
    try {
      const existingDoc = await this.doctorModel.findById(data.id);

      if (!existingDoc) {
        // console.log('Document not found for ID:', data.id);
        return null;
      }
      // Cập nhật dữ liệu từ input vào existingDoc
      Object.assign(existingDoc, data);
      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();
      // console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      return null;
    }
  }
  async findAll() {
    return await this.doctorModel.find();
  }
}
