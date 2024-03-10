import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Package } from './entities/package.entity';
import { Model } from 'mongoose';
import { CreatePackageInput } from './entities/dto/create-package.input';
import { UpdatePackageInput } from './entities/dto/update-package.input';
import { Console } from 'console';
import { deleteDatePast } from 'src/utils/contain';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name)
    private readonly model: Model<Package>,
  ) {}

  async findById(id: String): Promise<Package> {
    let currPackage = await this.model.findById(id);
    const dateOffs: [Date] = currPackage.workSchedule.dayOff;
    if (dateOffs.length > 0) {
      const removedPastDates: [Date] = deleteDatePast(dateOffs);
      if (removedPastDates !== dateOffs) {
        currPackage.workSchedule.dayOff = removedPastDates;
        const newPackage = await currPackage.save();
        return newPackage;
      }
      return currPackage;
    }
    return currPackage;
  }

  async findAll(): Promise<Package[]> {
    return await this.model.find();
  }
  async findByMedicalFacilityId(medicalFacilityId: String): Promise<Package[]> {
    return await this.model.find({
      medicalFactilitiesId: medicalFacilityId,
    });
  }
  async create(input: CreatePackageInput): Promise<Package> {
    return await this.model.create(input);
  }
  async update(input: UpdatePackageInput): Promise<Package> {
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
  async getTotalPackagesCountByFacilityId(facilityId: string): Promise<number> {
    const count = await this.model.countDocuments({
      medicalFactilitiesId: facilityId,
    });
    return count;
  }
  async delete(id: string): Promise<Package> {
    return this.model.findByIdAndDelete(id);
  }
}
