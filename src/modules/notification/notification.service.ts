import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationInput } from './entities/dtos/create-notification.input';
import { UpdateNotificationInput } from './entities/dtos/update-notification.input';
import { NotificationInput } from './entities/dtos/notification.input';
import { ETypeOfNotification } from 'src/contain';

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

  async create(data: CreateNotificationInput): Promise<Notification> {
    const input: NotificationInput = {
      content: data.content,
      detailPath: data.detailPath,
      status: ETypeOfNotification.NotSeen,
      userId: data.userId,
    };
    return await this.doctorModel.create(input);
  }
  async updateById(data: UpdateNotificationInput) {
    try {
      const existingDoc = await this.doctorModel.findById(data.id);

      if (!existingDoc) {
        return null;
      }
      Object.assign(existingDoc, data);
      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      return null;
    }
  }
  async seenAll(userId: string): Promise<void> {
    try {
      await this.doctorModel
        .updateMany(
          { userId: userId },
          { $set: { status: ETypeOfNotification.Seen } },
        )
        .exec();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }
  async seenById(id: string): Promise<void> {
    try {
      await this.doctorModel
        .findByIdAndUpdate(id, { $set: { status: ETypeOfNotification.Seen } })
        .exec();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }
  async findAll() {
    return await this.doctorModel.find();
  }
  async findByUserId(userId: string) {
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    const sortField = 'createdAt';
    var sortOrder = 'desc';
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    return await this.doctorModel
      .find({ userId: userId })
      .sort(sortOptions)
      .limit(10);
  }
}
