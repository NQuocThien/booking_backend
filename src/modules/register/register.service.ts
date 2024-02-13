import { Injectable } from '@nestjs/common';
import { Register } from './entities/register.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRegisterInput } from './entities/dtos/update-register.input';
import { EStateRegister, ETypeOfService } from 'src/contain';
import { CreateRegisterDoctorInput } from './entities/dtos/create-register-doctor.input';
import { CreateRegisterSpecialtyInput } from './entities/dtos/create-register-specialty.input';
import { CreateRegisterPackageInput } from './entities/dtos/create-register-package.Input';
import { CreateRegisterVaccineInput } from './entities/dtos/create-register-vaccine.input';
import { CreateRegisterInput } from './entities/dtos/create-register.input';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Register.name)
    private readonly model: Model<Register>,
  ) {}

  async createRegisterDoctor(
    data: CreateRegisterDoctorInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Doctor,
    };
    return await this.model.create(datainput);
  }

  async createRegisterSpecialty(
    data: CreateRegisterSpecialtyInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Specialty,
    };
    return await this.model.create(datainput);
  }

  async createRegisterPackage(
    data: CreateRegisterPackageInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Package,
    };
    return await this.model.create(datainput);
  }

  async createRegisterVaccine(
    data: CreateRegisterVaccineInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Vaccine,
    };
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
