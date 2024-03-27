// dataloader.service.ts

import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Profile } from './entity/profile.entity';
import { ProfileService } from './profile.service';

@Injectable()
export class ProfileLoaderService {
  private readonly loader: DataLoader<string, Profile>;
  constructor(private readonly profileService: ProfileService) {
    this.loader = new DataLoader<string, Profile>(async (ids: string[]) => {
      console.log(' -> Fetch Data From DB ', ids);
      const profiles = await this.profileService.findByIds(ids);
      // console.log(' -> -> Data  ', profiles);
      const profileMap: { [key: string]: Profile } = {};
      profiles.forEach((profile) => {
        profileMap[profile.id] = profile;
      });
      return ids.map((id) => profileMap[id]);
    });
  }
  async load(id: string): Promise<Profile> {
    const data = await this.loader.load(id);
    return data;
  }
}
