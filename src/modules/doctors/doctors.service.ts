import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './entities/docter.entity';
import { CreateDoctorInput } from './entities/dtos/create-doctor.input';
import { UpdateDoctorInput } from './entities/dtos/update-doctor.input';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
  ) {}
  async findOne(id: String): Promise<Doctor> {
    return this.doctorModel.findById(id);
  }
  async delete(id: String): Promise<Doctor> {
    return this.doctorModel.findByIdAndDelete(id);
  }

  async create(data: CreateDoctorInput) {
    return await this.doctorModel.create(data);
  }
  async updateById(data: UpdateDoctorInput) {
    try {
      const existingDoc = await this.doctorModel.findById(data.id);

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
  async findAll() {
    return await this.doctorModel.find();
  }
  async findOneById(id: String) {
    return await this.doctorModel.findById(id);
  }
  async findOneByUserId(userId: String) {
    return await this.doctorModel.findOne({ userId: userId });
  }
  async findOneByDegreeId(degreeId: String) {
    return await this.doctorModel.findOne({ degreeId: degreeId });
  }
  async findByFacilitiesId(id: String): Promise<Doctor[]> {
    return await this.doctorModel.find({ facilitiesId: id });
  }
}
