import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { Model } from 'mongoose';
import { CreateMedicalFacilitiesInput } from './entities/dto/create-medical-facilities.input';

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
  async createMedicalFacilities(
    data: CreateMedicalFacilitiesInput,
  ): Promise<MedicalFacilities> {
    // console.log(' test', data);
    return await this.medicalModel.create(data);
  }
}
