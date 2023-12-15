import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CarePackage } from './entities/care-package.entity';
import { Model } from 'mongoose';
import { createCarePackageInput } from './entities/dto/create-care-package.input';

@Injectable()
export class CarePackageService {
  constructor(
    @InjectModel(CarePackage.name)
    private readonly model: Model<CarePackage>,
  ) {}
  async create(input: createCarePackageInput): Promise<CarePackage> {
    return this.model.create(input);
  }
  async finById(id: String): Promise<CarePackage> {
    return this.model.findById(id);
  }
  async getByFacilitiesId(id: String): Promise<CarePackage[]> {
    return this.model.find({ medicalFacilitiesId: id });
  }
  async findOneByTypeId(id: String): Promise<CarePackage[]> {
    return this.model.find({ typePackageId: id });
  }
}
