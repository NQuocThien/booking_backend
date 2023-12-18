import { Injectable } from '@nestjs/common';
import { Register, RegisterState } from './entities/register.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRegisterInput } from './entities/dtos/create-register';
import { UpdateRegisterInput } from './entities/dtos/update-register.input';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Register.name)
    private readonly model: Model<Register>,
  ) {}
  async create(data: CreateRegisterInput): Promise<Register> {
    const datainput = {
      profileId: data.profileId,
      packegeId: data.packegeId,
      date: data.date,
      state: RegisterState.NoActive,
    };
    console.log('test data: ', datainput);
    return await this.model.create(datainput);
  }
  async update(data: UpdateRegisterInput): Promise<Register> {
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
  async getRegisterByPackageId(packageId: String): Promise<Register[]> {
    return await this.model.find({ packegeId: packageId });
  }
  async getRegisterByProfileId(profileId: String): Promise<Register[]> {
    return await this.model.find({ profileId: profileId });
  }
}
