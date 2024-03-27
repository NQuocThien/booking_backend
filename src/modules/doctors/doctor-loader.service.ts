// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Doctor } from './entities/doctor.entity';
import { DoctorsService } from './doctors.service';
@Injectable()
export class DoctorLoaderService {
  private readonly loader: DataLoader<string, Doctor>;
  constructor(private readonly doctorSrv: DoctorsService) {
    this.loader = new DataLoader<string, Doctor>(async (ids: string[]) => {
      const doctors = await this.doctorSrv.findByIds(ids);
      const doctorMap: { [key: string]: Doctor } = {};
      doctors.forEach((p) => {
        doctorMap[p.id] = p;
      });
      return ids.map((id) => doctorMap[id]);
    });
  }
  async load(id: string): Promise<Doctor> {
    const data = await this.loader.load(id);
    return data;
  }
}
