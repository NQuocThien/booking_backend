import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluate } from './entities/evaluate.entity';
import { Model } from 'mongoose';
import { CreateEvaluateInput } from './entities/dto/create-evaluate.input';
import { UpdateEvaluateInput } from './entities/dto/update-evaluate.input';
import { GetEvaluateOptionInput } from './entities/dto/get-evaluate-option.input';

@Injectable()
export class EvaluateService {
  constructor(
    @InjectModel(Evaluate.name)
    private readonly doctorModel: Model<Evaluate>,
  ) {}

  async findOneById(id: String): Promise<Evaluate> {
    return this.doctorModel.findById(id);
  }

  async findByOption(option: GetEvaluateOptionInput): Promise<Evaluate[]> {
    return this.doctorModel.find({ ...option });
  }

  async findOneByRegisId(id: String): Promise<Evaluate> {
    return this.doctorModel.findOne({ registerId: id }).exec();
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
        return null;
      }
      Object.assign(existingDoc, data);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      return null;
    }
  }
  async findAll() {
    return await this.doctorModel.find();
  }
}
