import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entity/profile.entity';
import { Model } from 'mongoose';
import { CreateProfileInput } from './entity/dtos/create-profile.input';
import { UpdateProfileInput } from './entity/dtos/update-profile.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly model: Model<Profile>,
  ) {}
  async create(profile: CreateProfileInput): Promise<Profile> {
    return this.model.create(profile);
  }
  async findById(id: String): Promise<Profile> {
    return this.model.findById(id);
  }
  async delete(id: String): Promise<Profile> {
    return this.model.findByIdAndRemove(id);
  }
  async update(data: UpdateProfileInput): Promise<Profile> {
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
  async getProfileByCustomerId(customerId: String): Promise<Profile[]> {
    return this.model.find({ customerId: customerId });
  }
}
