import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './entities/docter.entity';
import { CreateDoctorInput } from './entities/dtos/create-doctor.input';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<Doctor>,
  ) {}
  async create(data: CreateDoctorInput) {
    return await this.doctorModel.create(data);
  }
  async findAll() {
    return await this.doctorModel.find();
  }
  async findOneByUserId(userId: String) {
    return await this.doctorModel.find({ userId: userId });
  }
  async findOneByDegreeId(degreeId: String) {
    return await this.doctorModel.findOne({ degreeId: degreeId });
  }
  async findByFacilitiesId(id: String): Promise<Doctor[]> {
    return await this.doctorModel.find({ facilitiesId: id });
  }
}
