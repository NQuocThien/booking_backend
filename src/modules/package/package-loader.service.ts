// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Package } from './entities/package.entity';
import { PackageService } from './package.service';
@Injectable()
export class PackageLoaderService {
  private readonly loader: DataLoader<string, Package>;
  constructor(private readonly packageSrv: PackageService) {
    this.loader = new DataLoader<string, Package>(async (ids: string[]) => {
      const packages = await this.packageSrv.findByIds(ids);
      const packageMap: { [key: string]: Package } = {};
      packages.forEach((p) => {
        packageMap[p.id] = p;
      });
      return ids.map((id) => packageMap[id]);
    });
  }
  async load(id: string): Promise<Package> {
    const data = await this.loader.load(id);
    return data;
  }
  async clean(id: string): Promise<void> {
    this.loader.clear(id);
  }
}
