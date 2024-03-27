import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Package } from './entities/package.entity';
import { Model } from 'mongoose';
import { CreatePackageInput } from './entities/dto/create-package.input';
import { UpdatePackageInput } from './entities/dto/update-package.input';
import { Console } from 'console';
import { deleteDatePast } from 'src/utils/contain';
import { EStatusService } from 'src/contain';

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
  async findByIds(ids: string[]): Promise<Package[]> {
    let res = await this.model.find({ _id: { $in: ids } });

    return res;
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
  async getTotalPackagesCountByFacilityId(
    facilityId: string,
    isClient: boolean = false,
  ): Promise<number> {
    const query: any = { medicalFactilitiesId: facilityId };
    if (isClient) {
      query['workSchedule.status'] = EStatusService.Open;
    }
    const count = await this.model.countDocuments(query);
    return count;
  }
  async delete(id: string): Promise<Package> {
    return this.model.findByIdAndDelete(id);
  }
  async getAllPackagePaginationOfFacility(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    facilityId: string,
  ): Promise<Package[]> {
    const query = search
      ? {
          packageName: { $regex: search, $options: 'i' },
          medicalFactilitiesId: facilityId,
        }
      : { medicalFactilitiesId: facilityId };
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
  async getTotalPackagesCount(search: string): Promise<number> {
    const query = search
      ? { packageName: { $regex: new RegExp(search, 'i') } }
      : {};
    const count = await this.model.countDocuments(query);
    return count;
  }
  async getTotalPackagesCountOfFacility(
    search: string,
    facilityId: string,
  ): Promise<number> {
    const query = search
      ? {
          packageName: {
            $regex: new RegExp(search, 'i'),
            medicalFactilitiesId: facilityId,
          },
        }
      : { medicalFactilitiesId: facilityId };
    const count = await this.model.countDocuments(query);
    return count;
  }
}
