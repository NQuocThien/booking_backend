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
import { GetRegisterByOptionInput } from './entities/dtos/get-register-option.input';
import { ConfirmRegisterInput } from './entities/dtos/confirm-register.input';
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
      cancel: false,
    };
    return await this.model.create(datainput);
  }
  async getAllRegisterByOption(
    input: GetRegisterByOptionInput,
  ): Promise<Register[]> {
    const startOfDay = new Date(input.date);
    const endOfDay = new Date(input.date);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await this.model
      .find({
        ...input,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
    // console.log('---> ', data);
    return data;
  }

  async getAllRegisPending(
    input: GetRegisterByOptionInput,
  ): Promise<Register[]> {
    const startOfDay = new Date(input.date);
    const endOfDay = new Date(input.date);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await this.model
      .find({
        ...input,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec(); // tất cả các ký của ngày

    const regisFilter = data.filter((d) => {
      return d.state === EStateRegister.Pending;
    });
    console.log(regisFilter);
    return regisFilter;
  }

  async createRegisterSpecialty(
    data: CreateRegisterSpecialtyInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Specialty,
      cancel: false,
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
      cancel: false,
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
      cancel: false,
    };
    return await this.model.create(datainput);
  }

  async update(data: UpdateRegisterInput): Promise<Register> {
    try {
      const existingDoc = await this.model.findById(data.id);
      if (!existingDoc) {
        return null;
      }
      Object.assign(existingDoc, data);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }
  async confirmRegister(input: ConfirmRegisterInput): Promise<Register> {
    try {
      const existingDoc = await this.model.findById(input.registerId);
      if (existingDoc) {
        existingDoc.state = input.state;
        const updatedDoc = await existingDoc.save();
        return updatedDoc;
      }
      return null;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }
  async getRegisterByPackageId(packageId: String): Promise<Register[]> {
    return await this.model.find({ packegeId: packageId });
  }
  async getRegisterByProfileId(profileId: string): Promise<Register[]> {
    return await this.model.find({ profileId: profileId });
  }
  async getRegisterByProfileIds(profileIds: String[]): Promise<Register[]> {
    return await this.model.find({ profileId: { $in: profileIds } });
  }
  parseTimeStringToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const currentDate = new Date();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    return currentDate;
  }
}
