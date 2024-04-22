import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { Model } from 'mongoose';
import { CreateMedicalFacilityInput } from './entities/dto/create-medical-facilities.input';
import { UpdateMedicalFacilityInput } from './entities/dto/update-medical-facilities.input';
import { EStatusService, ETypeOfFacility, ETypeOfService } from 'src/contain';
import { DoctorsService } from '../doctors/doctors.service';
import { PackageService } from '../package/package.service';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';
import { VaccinationService } from '../vaccination/vaccination.service';

@Injectable()
export class MedicalFacilitiesService {
  constructor(
    @InjectModel(MedicalFacilities.name)
    private readonly medicalModel: Model<MedicalFacilities>,
    private readonly doctorSrv: DoctorsService,
    private readonly packageSrv: PackageService,
    private readonly specialtiesSrv: MedicalSpecialtiesService,
    private readonly vaccinationSrv: VaccinationService,
  ) {}

  async findMedicalFacilitiesByUserId(
    userId: String,
  ): Promise<MedicalFacilities> {
    return this.medicalModel.findOne({ userId: userId });
  }
  async findAll(): Promise<MedicalFacilities[]> {
    return this.medicalModel.find();
  }
  async findUserIds(): Promise<{ userId: string }[]> {
    return this.medicalModel.find({}, { userId: 1, _id: 0 });
  }
  async findById(id: String): Promise<MedicalFacilities> {
    return this.medicalModel.findById(id);
  }
  async findByIds(ids: string[]): Promise<MedicalFacilities[]> {
    return this.medicalModel.find({ _id: { $in: ids } });
  }
  async findByUserIds(ids: string[]): Promise<MedicalFacilities[]> {
    return this.medicalModel.find({ userId: { $in: ids } });
  }
  async getTotalFacilitiesCountForClient(
    search: string,
    searchField: string,
    type: ETypeOfFacility,
  ): Promise<number> {
    var query: any = {};
    query.status = { $eq: EStatusService.Open };
    if (search) query[searchField] = { $regex: search, $options: 'i' };
    if (type) query.typeOfFacility = type;

    const count = await this.medicalModel.countDocuments(query);
    return count;
  }
  async getTotalFacilitiesCount(
    search: string,
    type: ETypeOfFacility,
  ): Promise<number> {
    var query: any = {};
    if (search) query.medicalFacilityName = { $regex: search, $options: 'i' };
    if (type) query.typeOfFacility = type;
    const count = await this.medicalModel.countDocuments(query);
    return count;
  }
  async getTotalFacilitiesHaveSrvCountForClient(
    search: string,
    typeOfService: ETypeOfService,
  ): Promise<number> {
    var query: any = {};
    if (search) query.medicalFacilityName = { $regex: search, $options: 'i' };
    if (typeOfService) {
      var ids: string[] = await this.getIdsHaveSrv(typeOfService);
      query._id = { $in: ids };
    }
    const count = await this.medicalModel.countDocuments(query);
    return count;
  }
  async getAllMedicalFacilityPaginationForClient(
    search: string,
    searchField: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    type: ETypeOfFacility = undefined,
  ): Promise<MedicalFacilities[]> {
    var query: any = {};
    query.status = { $eq: EStatusService.Open };
    if (search) query[searchField] = { $regex: search, $options: 'i' };
    if (type) query.typeOfFacility = type;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;

    return this.medicalModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }
  async getAllMedicalFacilityPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    type: ETypeOfFacility = undefined,
  ): Promise<MedicalFacilities[]> {
    var query: any = {};
    if (search) query.medicalFacilityName = { $regex: search, $options: 'i' };
    if (type) query.typeOfFacility = type;
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;

    return this.medicalModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }
  async getAllMedicalFacilityHaveSrvPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    typeOfService: ETypeOfService = null,
  ): Promise<MedicalFacilities[]> {
    var query: any = {};
    if (search) query.medicalFacilityName = { $regex: search, $options: 'i' };
    if (typeOfService) {
      var ids: string[] = await this.getIdsHaveSrv(typeOfService);
      query._id = { $in: ids };
    }
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    const data = this.medicalModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .exec();
    return data;
  }
  async getTopMedicalFacilities(
    limit: number,
    type: ETypeOfFacility,
  ): Promise<MedicalFacilities[]> {
    return this.medicalModel.find({ typeOfFacility: type }).limit(limit);
  }

  async findOneByUserId(id: String): Promise<MedicalFacilities> {
    return this.medicalModel.findOne({ userId: id });
  }

  async createMedicalFacility(
    data: CreateMedicalFacilityInput,
  ): Promise<MedicalFacilities> {
    return await this.medicalModel.create(data);
  }
  async updateMedicalFacilities(
    data: UpdateMedicalFacilityInput,
  ): Promise<MedicalFacilities> {
    try {
      const existingDoc = await this.medicalModel.findById(data.id);
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
  async delete(id: String): Promise<MedicalFacilities> {
    return await this.medicalModel.findByIdAndDelete(id);
  }

  async getIdsHaveSrv(typeOfService: ETypeOfService): Promise<string[]> {
    var ids: string[] = [];
    if (typeOfService === ETypeOfService.Doctor) {
      // bác sỉ
      const doctors = await this.doctorSrv.findAll();
      const facilityIdsWithDoctors = doctors.map(
        (doctor) => doctor.medicalFactilitiesId,
      );
      const uniqueFacilityIds: string[] = [...new Set(facilityIdsWithDoctors)];
      const idHaveDoctor: string[] = uniqueFacilityIds.filter(
        (id) => id !== '',
      );
      ids = ids.concat(idHaveDoctor);
    } else if (typeOfService === ETypeOfService.Package) {
      // gói khám
      const packages = await this.packageSrv.findAll();
      const facilityIdsWithPackages = packages.map(
        (pack) => pack.medicalFactilitiesId,
      );
      const uniIds: string[] = [...new Set(facilityIdsWithPackages)];
      const idHavepackage: string[] = uniIds.filter((id) => id !== '');
      ids = ids.concat(idHavepackage);
    } else if (typeOfService === ETypeOfService.Specialty) {
      // chuyên khoa
      const vaccinations = await this.specialtiesSrv.getAll();
      const facilityIdsWithVaccination = vaccinations.map(
        (pack) => pack.medicalFactilityId,
      );
      const uniIds: string[] = [...new Set(facilityIdsWithVaccination)];
      const idHaveSpecialty: string[] = uniIds.filter((id) => id !== '');
      ids = ids.concat(idHaveSpecialty);
    } else if (typeOfService === ETypeOfService.Vaccine) {
      //
      const vaccinations = await this.vaccinationSrv.getAllVaccination();
      const facilityIdsWithVaccination = vaccinations.map(
        (vaccine) => vaccine.medicalFactilitiesId,
      );
      const uniIds: string[] = [...new Set(facilityIdsWithVaccination)];
      const idHaveVaccination: string[] = uniIds.filter((id) => id !== '');
      ids = ids.concat(idHaveVaccination);
    }
    return ids;
  }
}
