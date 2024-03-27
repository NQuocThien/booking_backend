// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Register } from './entities/register.entity';
import { RegisterService } from './register.service';

@Injectable()
export class RegisterLoaderService {
  private readonly loaderRegisters: DataLoader<string, Register[]>;
  constructor(private readonly regisService: RegisterService) {
    this.loaderRegisters = new DataLoader<string, Register[]>(
      async (ids: string[]) => {
        // console.log(' -> Fetch Data From DB ', ids);
        const registers = await this.regisService.getRegisterByProfileIds(ids);
        // console.log(' -> -> Data  ', registers);
        const regisMap: { [key: string]: Register[] } = {};
        ids.forEach((profileId) => {
          regisMap[profileId] = registers.filter(
            (regis) => regis.profileId === profileId,
          );
        });
        return ids.map((profileId) => regisMap[profileId] || []);
      },
    );
  }
  async load(id: string): Promise<Register[]> {
    const data = await this.loaderRegisters.load(id);
    return data;
  }
}
