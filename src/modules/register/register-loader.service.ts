// dataloader.service.ts
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Register } from './entities/register.entity';
import { RegisterService } from './register.service';
import { DoctorsService } from '../doctors/doctors.service';
import { PackageService } from '../package/package.service';
import { VaccinationService } from '../vaccination/vaccination.service';
import { MedicalSpecialtiesService } from '../medical-specialties/medical-specialties.service';

@Injectable()
export class RegisterLoaderService {
  private readonly loaderRegisters: DataLoader<string, Register[]>;
  private readonly loaderDoctorIds: DataLoader<string, string[]>;
  private readonly loaderPackageIds: DataLoader<string, string[]>;
  private readonly loaderSpecialtyIds: DataLoader<string, string[]>;
  private readonly loaderVaccinatioIds: DataLoader<string, string[]>;
  constructor(
    private readonly regisService: RegisterService,
    private readonly doctorSr: DoctorsService,
    private readonly packageSrv: PackageService,
    private readonly vaccinationSrv: VaccinationService,
    private readonly specialtySrv: MedicalSpecialtiesService,
  ) {
    this.loaderRegisters = new DataLoader<string, Register[]>(
      async (ids: string[]) => {
        const registers = await this.regisService.getRegisterByProfileIds(ids);
        const regisMap: { [key: string]: Register[] } = {};
        ids.forEach((profileId) => {
          regisMap[profileId] = registers.filter(
            (regis) => regis.profileId === profileId,
          );
        });
        return ids.map((profileId) => regisMap[profileId] || []);
      },
    );
    this.loaderDoctorIds = new DataLoader<string, string[]>(
      async (hospitalIds: string[]) => {
        const doctorIdsMap: { [key: string]: string[] } = {};
        await Promise.all(
          hospitalIds.map(async (hospitalId) => {
            const doctors = await this.doctorSr.getIdsByfacilityId(hospitalId);
            doctorIdsMap[hospitalId] = doctors.map((doctor) =>
              doctor.id.toString(),
            );
          }),
        );
        return hospitalIds.map((hospitalId) => doctorIdsMap[hospitalId] || []);
      },
    );
    this.loaderPackageIds = new DataLoader<string, string[]>(
      async (hospitalIds: string[]) => {
        const packageIdsMap: { [key: string]: string[] } = {};
        await Promise.all(
          hospitalIds.map(async (hospitalId) => {
            const packages =
              await this.packageSrv.getAllPackageOfFacility(hospitalId);
            packageIdsMap[hospitalId] = packages.map((p) => p.id.toString());
          }),
        );
        return hospitalIds.map((hospitalId) => packageIdsMap[hospitalId] || []);
      },
    );
    this.loaderSpecialtyIds = new DataLoader<string, string[]>(
      async (hospitalIds: string[]) => {
        const docMap: { [key: string]: string[] } = {};
        await Promise.all(
          hospitalIds.map(async (hospitalId) => {
            const docs =
              await this.specialtySrv.getAllByMedicalFacilytyId(hospitalId);
            docMap[hospitalId] = docs.map((p) => p.id.toString());
          }),
        );
        return hospitalIds.map((hospitalId) => docMap[hospitalId] || []);
      },
    );
    this.loaderVaccinatioIds = new DataLoader<string, string[]>(
      async (hospitalIds: string[]) => {
        const docMap: { [key: string]: string[] } = {};
        await Promise.all(
          hospitalIds.map(async (hospitalId) => {
            const docs =
              await this.vaccinationSrv.getAllVaccinationOfFacility(hospitalId);
            docMap[hospitalId] = docs.map((p) => p.id.toString());
          }),
        );
        return hospitalIds.map((hospitalId) => docMap[hospitalId] || []);
      },
    );
  }
  async load(id: string): Promise<Register[]> {
    // by profile id
    const data = await this.loaderRegisters.load(id);
    return data;
  }
  async clean(profileId: string) {
    this.loaderRegisters.clear(profileId);
  }

  async loadDoctorIdsByFacilityId(id: string): Promise<string[]> {
    // by profile id
    const data = await this.loaderDoctorIds.load(id);
    return data;
  }
  async cleanDoctorIdsByFacilityId(id: string) {
    this.loaderDoctorIds.clear(id);
  }

  async loadPackageIdsByFacilityId(id: string): Promise<string[]> {
    // by profile id
    const data = await this.loaderPackageIds.load(id);
    return data;
  }
  async cleanPackageIdsBFacilityId(id: string) {
    this.loaderPackageIds.clear(id);
  }

  async loadVaccinationIdsByFacilityId(id: string): Promise<string[]> {
    // by profile id
    const data = await this.loaderVaccinatioIds.load(id);
    return data;
  }
  async cleanVaccinationIdsBFacilityId(id: string) {
    this.loaderVaccinatioIds.clear(id);
  }

  async loadSpecialtyIdsByFacilityId(id: string): Promise<string[]> {
    // by profile id
    const data = await this.loaderSpecialtyIds.load(id);
    return data;
  }
  async cleanSpecialtyIdsBFacilityId(id: string) {
    this.loaderSpecialtyIds.clear(id);
  }
}
