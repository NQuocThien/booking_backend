// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MedicalFacilities } from './entities/mecical-facilies.entity';
import { MedicalFacilitiesService } from './medical-facilities.service';
@Injectable()
export class FacilitiesLoaderService {
  private readonly loader: DataLoader<string, MedicalFacilities>;
  constructor(private readonly facilitySrv: MedicalFacilitiesService) {
    this.loader = new DataLoader<string, MedicalFacilities>(
      async (ids: string[]) => {
        // console.log(' -> Fetch Data From DB ', ids);
        const facilies = await this.facilitySrv.findByIds(ids);
        const faciliesMap: { [key: string]: MedicalFacilities } = {};
        facilies.forEach((s) => {
          faciliesMap[s.id] = s;
        });
        return ids.map((id) => faciliesMap[id]);
      },
    );
  }
  async load(id: string): Promise<MedicalFacilities> {
    console.log('id facilitates: ', id);
    const data = await this.loader.load(id);
    return data;
  }
}
