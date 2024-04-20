import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalStaff } from './entities/medical-staff.entity';
import { Model } from 'mongoose';
import { CreateMedicalStaffInput } from './entities/dto/create-medical-staff.input';
import { UpdateMedicalStaffInput } from './entities/dto/update-medical-staff.input';

@Injectable()
export class MedicalStaffService {
  constructor(
    @InjectModel(MedicalStaff.name)
    private readonly model: Model<MedicalStaff>,
  ) {}

  async getAllMedicalStaff(): Promise<MedicalStaff[]> {
    return await this.model.find();
  }
  async getAllUserMedicalStaff(facilityId: string): Promise<string[]> {
    const arr = await this.model
      .find({ medicalFacilityId: facilityId }, 'userId')
      .exec();
    const userIds: string[] = arr.map((s) => s.userId as string);
    console.log('test staff:', userIds);
    return userIds;
  }
  async findById(id: String): Promise<MedicalStaff> {
    return await this.model.findById(id);
  }
  async findByUserId(id: String): Promise<MedicalStaff> {
    return await this.model.findOne({ userId: id });
  }
  async createMedicalStaff(
    input: CreateMedicalStaffInput,
  ): Promise<MedicalStaff> {
    return await this.model.create(input);
  }
  async updateMedicalStaff(
    input: UpdateMedicalStaffInput,
  ): Promise<MedicalStaff> {
    try {
      const existingDoc = await this.model.findById(input.id);
      if (!existingDoc) {
        // console.log('Document not found for ID:', input.id);
        return null;
      }
      // Cập nhật dữ liệu từ input vào existingDoc
      Object.assign(existingDoc, input);
      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();
      // console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      // console.error('Error updating document:', error);
      return null;
    }
  }
  async deleteMedicalStaff(id: String) {
    return await this.model.findByIdAndDelete(id);
  }
  async findByMedicalFacilityId(
    medicalFacilityId: String,
  ): Promise<MedicalStaff[]> {
    return await this.model.find({ medicalFacilityId: medicalFacilityId });
  }
  async getAllStaffPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
  ): Promise<MedicalStaff[]> {
    const query = search
      ? { staffName: { $regex: search, $options: 'i' } }
      : {};
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.model
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }

  async getTotalStaffCount(search: string): Promise<number> {
    const query = search
      ? { staffName: { $regex: new RegExp(search, 'ui') } }
      : {};
    const count = await this.model.countDocuments(query);
    return count;
  }

  async getAllMedicalStaffPaginationOfFacility(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    facilityId: string,
  ): Promise<MedicalStaff[]> {
    const query = search
      ? {
          staffName: { $regex: search, $options: 'i' },
          medicalFacilityId: facilityId,
        }
      : { medicalFacilityId: facilityId };
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.model
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .exec();
  }
  async getTotalStaffCountOfFacility(
    search: string,
    facilityId: string,
  ): Promise<number> {
    const query = search
      ? {
          staffName: {
            $regex: new RegExp(search, 'i'),
            medicalFacilityId: facilityId,
          },
        }
      : { medicalFactilitiesId: facilityId };
    const count = await this.model.countDocuments(query);
    return count;
  }
}
