// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { MedicalStaff } from './entities/medical-staff.entity';
import { MedicalStaffService } from './medical-staff.service';
@Injectable()
export class StaffLoaderService {
  private readonly loader: DataLoader<string, MedicalStaff>;
  private readonly loader2: DataLoader<string, MedicalStaff>;

  constructor(private readonly staffSrv: MedicalStaffService) {
    this.loader = new DataLoader<string, MedicalStaff>(
      async (ids: string[]) => {
        const staffs = await this.staffSrv.findByIds(ids);
        const staffMap: { [key: string]: MedicalStaff } = {};
        staffs.forEach((p) => {
          staffMap[p.id] = p;
        });
        return ids.map((id) => staffMap[id]);
      },
    );
    this.loader2 = new DataLoader<string, MedicalStaff>(
      async (ids: string[]) => {
        const staffs = await this.staffSrv.findByUserIds(ids);
        const staffMap: { [key: string]: MedicalStaff } = {};
        staffs.forEach((p) => {
          staffMap[p.userId] = p;
        });
        return ids.map((id) => staffMap[id]);
      },
    );
  }
  async load(id: string): Promise<MedicalStaff> {
    const data = await this.loader.load(id);
    return data;
  }
  async loadByUserId(id: string): Promise<MedicalStaff> {
    const data = await this.loader2.load(id);
    return data;
  }
}
