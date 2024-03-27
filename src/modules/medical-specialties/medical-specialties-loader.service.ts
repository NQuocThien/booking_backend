// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MedicalSpecialties } from './entities/medical-specialties.entity';
import { MedicalSpecialtiesService } from './medical-specialties.service';
@Injectable()
export class MedicalSpecialtiesLoaderService {
  private readonly loader: DataLoader<string, MedicalSpecialties>;
  constructor(private readonly specialtySrv: MedicalSpecialtiesService) {
    this.loader = new DataLoader<string, MedicalSpecialties>(
      async (ids: string[]) => {
        const specialties = await this.specialtySrv.findByIds(ids);
        const specialtiesMap: { [key: string]: MedicalSpecialties } = {};
        specialties.forEach((s) => {
          specialtiesMap[s.id] = s;
        });
        return ids.map((id) => specialtiesMap[id]);
      },
    );
  }
  async load(id: string): Promise<MedicalSpecialties> {
    const data = await this.loader.load(id);
    return data;
  }
}
