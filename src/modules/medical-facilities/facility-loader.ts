// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { MedicalFacilitiesService } from './medical-facilities.service';
@Injectable()
export class FacilitiesLoaderService {
  private readonly loader: DataLoader<string, MedicalFacilities>;
  private readonly loader2: DataLoader<string, MedicalFacilities>;
  constructor(private readonly facilitySrv: MedicalFacilitiesService) {
    this.loader = new DataLoader<string, MedicalFacilities>(
      async (ids: string[]) => {
        const doctors = await this.facilitySrv.findByIds(ids);
        const facilityMap: { [key: string]: MedicalFacilities } = {};
        doctors.forEach((p) => {
          facilityMap[p.id] = p;
        });
        return ids.map((id) => facilityMap[id]);
      },
    );
    this.loader2 = new DataLoader<string, MedicalFacilities>(
      async (ids: string[]) => {
        const facilities = await this.facilitySrv.findByUserIds(ids);
        const facilityMap: { [key: string]: MedicalFacilities } = {};
        facilities.forEach((p) => {
          facilityMap[p.userId] = p;
        });
        return ids.map((id) => facilityMap[id]);
      },
    );
  }
  async load(id: string): Promise<MedicalFacilities> {
    const data = await this.loader.load(id);
    return data;
  }
  async loadByUserId(id: string): Promise<MedicalFacilities> {
    const data = await this.loader2.load(id);
    return data;
  }
}
