import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationInput } from './entities/dtos/create-notification.input';
import { UpdateNotificationInput } from './entities/dtos/update-notification.input';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly doctorModel: Model<Notification>,
  ) {}

  async findOneById(id: String): Promise<Notification> {
    return this.doctorModel.findById(id);
  }

  async delete(id: String): Promise<Notification> {
    return this.doctorModel.findByIdAndDelete(id);
  }

  async create(data: CreateNotificationInput) {
    return await this.doctorModel.create(data);
  }
  async updateById(data: UpdateNotificationInput) {
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
      // console.error('Error updating document:', error);
      return null;
    }
  }
  async findAll() {
    return await this.doctorModel.find();
  }
}
