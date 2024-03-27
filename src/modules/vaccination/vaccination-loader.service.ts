// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Vaccination } from './entities/Vaccination.entity';
import { VaccinationService } from './vaccination.service';
@Injectable()
export class VaccinationLoaderService {
  private readonly loader: DataLoader<string, Vaccination>;
  constructor(private readonly vaccinationSrv: VaccinationService) {
    this.loader = new DataLoader<string, Vaccination>(async (ids: string[]) => {
      // console.log(' -> Fetch Data From DB ', ids);
      const vaccinations = await this.vaccinationSrv.findByIds(ids);
      const vaccinationMap: { [key: string]: Vaccination } = {};
      vaccinations.forEach((s) => {
        vaccinationMap[s.id] = s;
      });
      return ids.map((id) => vaccinationMap[id]);
    });
  }
  async load(id: string): Promise<Vaccination> {
    const data = await this.loader.load(id);
    return data;
  }
}
