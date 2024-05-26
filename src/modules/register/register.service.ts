import { Injectable } from '@nestjs/common';
import { Register } from './entities/register.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRegisterInput } from './entities/dtos/update-register.input';
import { EStateRegister, EStatusService, ETypeOfService } from 'src/contain';
import { CreateRegisterDoctorInput } from './entities/dtos/create-register-doctor.input';
import { CreateRegisterSpecialtyInput } from './entities/dtos/create-register-specialty.input';
import { CreateRegisterPackageInput } from './entities/dtos/create-register-package.Input';
import { CreateRegisterVaccineInput } from './entities/dtos/create-register-vaccine.input';
import { CreateRegisterInput } from './entities/dtos/create-register.input';
import { GetRegisterByOptionInput } from './entities/dtos/get-register-option.input';
import { ConfirmRegisterInput } from './entities/dtos/confirm-register.input';
import { GetAllRegisInYearInput } from './entities/dtos/get-all-register.input';
import { GetRegisHistoryInput } from './entities/dtos/get-register-history.input copy';
import { SessionInput } from '../contains/session/session.input';
import { UpLoadFileRegisInput } from './entities/dtos/upload-file.input';
import { LinkImage } from '../users/dto/image';
import { deleteDocument } from 'src/utils/delete_image';
import { RegisPendingInput } from './entities/dtos/regis-pending.input';
import { ProfileService } from '../profile/profile.service';
import { GetRegisterHaveInput } from './entities/dtos/get-register-have.input';

interface IServiceIds {
  doctorsIds: string[];
  packagesIds: string[];
  vaccinesIds: string[];
  specialtiesIds: string[];
}
@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Register.name)
    private readonly model: Model<Register>,
    private readonly profileSrv: ProfileService,
  ) {}

  async findById(id: string): Promise<Register> {
    return await this.model.findById(id);
  }

  async isExistInDay(
    date: string,
    session: SessionInput,
    profileId: string,
    maxslot?: number,
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
    if (maxslot) {
      const allRegisSession = await this.model
        .count({
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          'session.startTime': { $eq: session.startTime },
          'session.endTime': { $eq: session.endTime },
        })
        .exec();
      if (allRegisSession > maxslot) {
        throw new Error('Phiên khám đã đầy!');
      }
    }
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

  async getRegisDate(date: string): Promise<Register[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const regis = await this.model
      .find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
    return regis;
  }
  async createRegisterDoctor(
    data: CreateRegisterDoctorInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Doctor,
      cancel: false,
      createdBy: data.createBy,
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

  async getAllRegisPending(
    input: RegisPendingInput,
    page: number,
    limit: number,
    search: string = undefined,
    missed: boolean = false,
  ): Promise<Register[]> {
    const startOfDay = new Date(input.startTime);
    const endOfDay = new Date(input.endTime);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = { $or: [] };
    if (search) {
      const ids = await this.profileSrv.findByFullName(search);
      query.profileId = { $in: ids };
    }
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
    query.cancel = { $eq: input.cancel };
    if (missed) {
      query.state = { $eq: EStateRegister.Approved };
      query.date = {
        $lte: startOfDay,
      };
      query.cancel = { $eq: false };
    }

    const skip = (page - 1) * limit;
    const data = await this.model
      .find({
        ...query,
      })
      .limit(limit)
      .skip(skip)
      .exec();
    return data;
  }

  async getAllRegisPendingCount(
    input: RegisPendingInput,
    missed: boolean = false,
  ): Promise<number> {
    const startOfDay = new Date(input.startTime);
    const endOfDay = new Date(input.endTime);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = { $or: [] };
    query.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
    if (missed) {
      query.date = {
        $lte: startOfDay,
      };
    }
    if (input.typeOfService) query.typeOfService = { $eq: input.typeOfService };
    query.$or.push({ doctorId: { $in: input.doctorIds } });
    query.$or.push({ packageId: { $in: input.packageIds } });
    query.$or.push({ specialtyId: { $in: input.specialtyIds } });
    query.$or.push({ vaccineId: { $in: input.vaccineIds } });

    query.state = { $eq: EStateRegister.Pending };
    if (missed) {
      query.state = { $eq: false };
    }
    query.cancel = { $eq: input.cancel };
    const data = await this.model
      .find({
        ...query,
      })
      .count();
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

  async getAllRegisOfService(input: GetRegisterHaveInput): Promise<Register[]> {
    const startOfDay = new Date(input.date);
    const endOfDay = new Date(input.date);

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const query: any = {};
    query.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
    if (input.type === ETypeOfService.Doctor)
      query.doctorId = { $eq: input.serviceId };
    if (input.type === ETypeOfService.Package)
      query.packageId = { $eq: input.serviceId };
    if (input.type === ETypeOfService.Specialty)
      query.specialtyId = { $eq: input.serviceId };
    if (input.type === ETypeOfService.Vaccine)
      query.vaccineId = { $eq: input.serviceId };
    query.cancel = { $eq: false };
    const data = await this.model
      .find({
        ...query,
      })
      .exec();
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
      createdBy: data.createBy,
    };
    return await this.model.create(datainput);
  }

  async createRegisterPackage(
    data: CreateRegisterPackageInput,
  ): Promise<Register> {
    var datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Package,
      cancel: false,
      createdBy: data.createBy,
    };
    // console.log('-> input: ', datainput);
    const res = await this.model.create(datainput);
    return res;
  }

  async createRegisterVaccine(
    data: CreateRegisterVaccineInput,
  ): Promise<Register> {
    const datainput: CreateRegisterInput = {
      ...data,
      state: EStateRegister.Pending,
      typeOfService: ETypeOfService.Vaccine,
      cancel: false,
      createdBy: data.createBy,
    };
    const res = await this.model.create(datainput);
    return res;
  }

  async cancelRegis(id: string): Promise<Register> {
    try {
      const updateDoc = await this.model.findByIdAndUpdate(
        id,
        { cancel: true },
        { new: true },
      );

      return updateDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }
  async uploadFile(input: UpLoadFileRegisInput): Promise<Register> {
    try {
      const oldDoc = await this.model.findById(input.id);
      if (!oldDoc) {
        return null;
      }
      const fileDeleted: LinkImage[] = oldDoc.files.filter(
        (f) => !input.files.find((olf) => olf.url === f.url),
      );
      // console.log(' -->  file old: ', oldDoc.files);
      // console.log(' -->  file new: ', input.files);
      // console.log(' -->  file delete: ', fileDeleted);
      for (var doc of fileDeleted) {
        deleteDocument(doc);
      }
      Object.assign(oldDoc, { files: input.files });

      const updatedDoc = await oldDoc.save();
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
    var existingDoc = await this.model.findById(input.registerId);
    if (existingDoc) {
      if (existingDoc.cancel) {
        throw new Error(
          'Không thể thực hiện thao tác do yêu cầu đăng ký đã hủy',
        );
      }
      existingDoc.state = input.state;
      if (input.note) {
        existingDoc.note = input.note;
      }
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    }
    return null;
  }
  async confirmRegisters(input: ConfirmRegisterInput[]): Promise<Register[]> {
    const updatePromises = await input.map((item) =>
      this.model.findByIdAndUpdate(
        item.registerId,
        {
          state: item.state,
          note: item.note,
        },
        { new: true },
      ),
    );
    var dateUpdated: Register[];
    await Promise.all(updatePromises)
      .then((updatedDocs) => {
        dateUpdated = updatedDocs;
      })
      .catch((err) => {
        console.error('Error updating users:', err);
      });

    return dateUpdated;
  }
  async regisDoctorCount(
    doctorId: string,
    startTime: string,
    endTime: string,
    isPending: boolean = false,
    isCancel: boolean = false,
    missed: boolean = false,
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

    query.cancel = { $eq: isCancel };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };
    if (missed) {
      query.date = {
        $lte: startDate,
      };
      query.cancel = { $eq: false };
      query.state = { $eq: EStateRegister.Approved };
    }
    // console.log('doctor missed', missed);
    // console.log('doctor query:', query);
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
    isCancel: boolean = false,
    missed: boolean = false,
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
    query.cancel = { $eq: isCancel };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };
    if (missed) {
      query.date = {
        $lte: startDate,
      };
      query.cancel = { $eq: false };
      query.state = { $eq: EStateRegister.Approved };
    }
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
    isCancel: boolean = false,
    missed: boolean = false,
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
    query.cancel = isCancel;
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };
    if (missed) {
      query.date = {
        $lte: startDate,
      };
      query.cancel = { $eq: false };
      query.state = { $eq: EStateRegister.Approved };
    }
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
    isCancel: boolean = false,
    missed: boolean = false,
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
    query.cancel = { $eq: isCancel };
    if (isPending) query.state = { $eq: EStateRegister.Pending };
    else query.state = { $ne: EStateRegister.Pending };
    if (missed) {
      query.date = {
        $lte: startDate,
      };
      query.cancel = { $eq: false };
      query.state = { $eq: EStateRegister.Approved };
    }
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
  async getAllReistrationMissed(
    profileIds: String[],
    serviceIds: IServiceIds,
  ): Promise<Register[]> {
    const now = new Date();
    const query: any = { $or: [] };
    query.$or.push({ doctorId: { $in: serviceIds.doctorsIds } });
    query.$or.push({ packageId: { $in: serviceIds.packagesIds } });
    query.$or.push({ specialtyId: { $in: serviceIds.specialtiesIds } });
    query.$or.push({ vaccineId: { $in: serviceIds.vaccinesIds } });
    query.date = { $lte: now };
    query.profileId = { $in: profileIds };
    query.cancel = { $eq: false };
    query.state = { $eq: EStateRegister.Approved };
    const res = await this.model.find({
      ...query,
    });
    return res;
  }
  async getAllReistrationMissedThisMonth(
    profileIds: String[],
    serviceIds: IServiceIds,
  ): Promise<Register[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const query: any = { $or: [] };
    query.$or.push({ doctorId: { $in: serviceIds.doctorsIds } });
    query.$or.push({ packageId: { $in: serviceIds.packagesIds } });
    query.$or.push({ specialtyId: { $in: serviceIds.specialtiesIds } });
    query.$or.push({ vaccineId: { $in: serviceIds.vaccinesIds } });
    query.date = {};

    const res = this.model.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      profileId: { $in: profileIds },
    });
    return res;
  }
  async getAllReistrationByIdService(
    serviceIds: IServiceIds,
  ): Promise<Register[]> {
    const query: any = { $or: [] };
    query.$or.push({ doctorId: { $in: serviceIds.doctorsIds } });
    query.$or.push({ packageId: { $in: serviceIds.packagesIds } });
    query.$or.push({ specialtyId: { $in: serviceIds.specialtiesIds } });
    query.$or.push({ vaccineId: { $in: serviceIds.vaccinesIds } });
    const res = await this.model
      .find({
        ...query,
      })
      .sort({ date: 'desc' });
    return res;
  }
}
