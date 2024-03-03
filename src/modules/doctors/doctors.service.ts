import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorInput } from './entities/dtos/create-doctor.input';
import { UpdateDoctorInput } from './entities/dtos/update-doctor.input';
import { deleteDatePast } from 'src/utils/contain';

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
  async findOneById(id: String) {
    let currDoctor = await this.doctorModel.findById(id);
    const dateOffs: [Date] = currDoctor.workSchedule.dayOff;
    if (dateOffs.length > 0) {
      const removedPastDates: [Date] = deleteDatePast(dateOffs);
      if (removedPastDates !== dateOffs) {
        currDoctor.workSchedule.dayOff = removedPastDates;
        const newDoctor = await currDoctor.save();
        return newDoctor;
      }
      return currDoctor;
    }
    return currDoctor;
    return await this.doctorModel.findById(id);
  }
  async findOneByUserId(userId: String) {
    return await this.doctorModel.findOne({ userId: userId });
  }
  async findOneByDegreeId(degreeId: String) {
    return await this.doctorModel.findOne({ degreeId: degreeId });
  }
  async findByFacilitiesId(id: String): Promise<Doctor[]> {
    return await this.doctorModel.find({ medicalFactilitiesId: id });
  }
}
