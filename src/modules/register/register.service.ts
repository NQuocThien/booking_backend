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
import { GetAllRegisInYearInput } from './entities/dtos/get-all-register.input';
@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Register.name)
    private readonly model: Model<Register>,
  ) {}
  async isExistInDay(date: string, profileId: string): Promise<Boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const regis = await this.model
      .findOne({
        profileId: profileId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
    if (regis) return true;
    return false;
  }

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

  async getAllRegisInYear(filter: GetAllRegisInYearInput): Promise<Register[]> {
    const startDate = new Date(filter.year, 0, 1); // Ngày đầu tiên của năm
    const endDate = new Date(filter.year, 11, 31, 23, 59, 59); // Ngày cuối cùng của năm
    const data = await this.model
      .find(
        {
          date: {
            $gte: startDate,
            $lte: endDate,
          },

          $or: [
            { doctorId: filter.doctorIds },
            { packageId: filter.packageIds },
            { vaccineId: filter.vaccineIds },
            { specialtyId: filter.specialtyIds },
          ],
        },
        'typeOfService',
      )
      .exec(); // tất cả các ký của ngày

    return data;
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

  async cancelRegis(id: string): Promise<Register> {
    try {
      const existingDoc = await this.model.findByIdAndUpdate(
        id,
        { cancel: true },
        { new: true },
      );
      if (!existingDoc) {
        return null;
      }
      const newDoc = {
        ...existingDoc,
        cancel: true,
      };
      Object.assign(existingDoc, newDoc);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
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
  async regisDoctorCount(
    doctorId: string,
    startTime: string,
    endTime: string,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const count = await this.model.count({
      doctorId: doctorId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return count;
  }
  async regisVaccinationCount(
    vaccineId: string,
    startTime: string,
    endTime: string,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const count = await this.model.count({
      vaccineId: vaccineId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return count;
  }
  async regisPackageCount(
    packageId: string,
    startTime: string,
    endTime: string,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const count = await this.model.count({
      packageId: packageId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return count;
  }
  async regisSpecialtyCount(
    specialistId: string,
    startTime: string,
    endTime: string,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const count = await this.model.count({
      specialtyId: specialistId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return count;
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
