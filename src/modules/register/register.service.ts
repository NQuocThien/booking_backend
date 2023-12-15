import { Injectable } from '@nestjs/common';
import { Register } from './entities/register.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRegisterInput } from './entities/dtos/create-register';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Register.name)
    private readonly model: Model<Register>,
  ) {}
  async create(data: CreateRegisterInput): Promise<Register> {
    return await this.model.create(data);
  }
  async getRegisterByPackageId(packageId: String): Promise<Register[]> {
    return await this.model.find({ packegeId: packageId });
  }
}
