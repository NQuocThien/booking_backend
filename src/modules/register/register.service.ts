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
import { GetRegisPendingInput } from './entities/dtos/get-regis-pending.input';
import { GetRegisHistoryInput } from './entities/dtos/get-register-history.input copy';
import { SessionInput } from '../contains/session/session.input';
@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Register.name)
    private readonly model: Model<Register>,
  ) {}
  async isExistInDay(
    date: string,
    session: SessionInput,
    profileId: string,
  ): Promise<Boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const regis = await this.model
      .find({
        profileId: profileId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
    if (regis.length > 5) return true;
    if (
      regis.find(
        (r) =>
          r.session.startTime === session.startTime &&
          r.session.endTime === session.endTime,
      )
    )
      return true;
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

    const query: any = {};
    query.doctorId = { $eq: input.doctorId };
    query.packageId = { $eq: input.packageId };
    query.vaccineId = { $eq: input.vaccineId };
    query.specialtyId = { $eq: input.specialtyId };
    query.date = { $eq: input.date };

    if (input.pedding) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };
    const data = await this.model
      .find({
        ...query,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
    return data;
  }

  async getAllRegisPending(input: GetRegisPendingInput): Promise<Register[]> {
    const startOfDay = new Date(input.startTime);
    const endOfDay = new Date(input.endTime);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = { $or: [] };
    query.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
    if (input.typeOfService) query.typeOfService = { $eq: input.typeOfService };
    query.$or.push({ doctorId: { $in: input.doctorIds } });
    query.$or.push({ packageId: { $in: input.packageIds } });
    query.$or.push({ specialtyId: { $in: input.specialtyIds } });
    query.$or.push({ vaccineId: { $in: input.vaccineIds } });

    query.state = { $eq: EStateRegister.Pending };
    const data = await this.model
      .find({
        ...query,
      })
      .exec();
    // console.log('test get pending: ', data, query);
    return data;
  }

  async getRegisHistory(
    input: GetRegisHistoryInput,
    sortField: string,
    sortOrder: string,
  ): Promise<Register[]> {
    const query: any = { $or: [] };

    query.$or.push({ doctorId: { $in: input.doctorIds } });
    query.$or.push({ packageId: { $in: input.packageIds } });
    query.$or.push({ specialtyId: { $in: input.specialtyIds } });
    query.$or.push({ vaccineId: { $in: input.vaccineIds } });

    query.profileId = { $eq: input.profileId };
    // query.state = { $eq: EStateRegister.Pending };
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const data = await this.model
      .find({
        ...query,
      })
      .sort(sortOptions)
      .exec();
    // console.log('test get pending: ', input);
    return data;
  }

  async getAllRegisOfService(
    input: GetRegisterByOptionInput,
  ): Promise<Register[]> {
    const startOfDay = new Date(input.date);
    const endOfDay = new Date(input.date);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = { $or: [] };
    query.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
    query.$or.push({ doctorId: { $eq: input.doctorId } });
    query.$or.push({ packageId: { $eq: input.packageId } });
    query.$or.push({ specialtyId: { $eq: input.specialtyId } });
    query.$or.push({ vaccineId: { $eq: input.vaccineId } });
    const data = await this.model
      .find({
        ...query,
      })
      .exec();
    // console.log('test get pending: ', data, query);
    return data;
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
    isPending: boolean = false,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    const query: any = {};

    query.doctorId = { $eq: doctorId };
    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };

    const count = await this.model.count({
      ...query,
    });
    return count;
  }
  async regisVaccinationCount(
    vaccineId: string,
    startTime: string,
    endTime: string,
    isPending: boolean = false,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    const query: any = {};

    query.vaccineId = { $eq: vaccineId };
    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };

    const count = await this.model.count({
      ...query,
    });
    return count;
  }
  async regisPackageCount(
    packageId: string,
    startTime: string,
    endTime: string,
    isPending: boolean = false,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    const query: any = {};

    query.packageId = { $eq: packageId };
    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };

    const count = await this.model
      .count({
        ...query,
      })
      .exec();
    return count;
  }
  async regisSpecialtyCount(
    specialistId: string,
    startTime: string,
    endTime: string,
    isPending: boolean = false,
  ): Promise<number> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    const query: any = {};

    query.specialtyId = { $eq: specialistId };
    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };

    const count = await this.model
      .count({
        ...query,
      })
      .exec();
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
