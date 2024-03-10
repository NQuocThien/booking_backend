import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entity/profile.entity';
import { Model } from 'mongoose';
import { CreateProfileInput } from './entity/dtos/create-profile.input';
import { UpdateProfileInput } from './entity/dtos/update-profile.input';
import * as DataLoader from 'dataloader';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly model: Model<Profile>,
  ) {}

  private profileLoader = new DataLoader<string, Profile[]>(
    async (customerIds) => {
      const profiles = await this.model
        .find({ customerId: { $in: customerIds } })
        .exec();
      const profileMap = new Map<string, Profile[]>();
      profiles.forEach((profile) => {
        const customerId = profile.customerId.toString();
        if (profileMap.has(customerId)) {
          profileMap.get(customerId).push(profile);
        } else {
          profileMap.set(customerId, [profile]);
        }
      });
      return customerIds.map(
        (customerId) => profileMap.get(customerId) || null,
      );
    },
  );

  async create(profile: CreateProfileInput): Promise<Profile> {
    return this.model.create(profile);
  }
  async findById(id: String): Promise<Profile> {
    return this.model.findById(id);
  }
  async findAll(): Promise<Profile[]> {
    const result = await this.model.find();
    // console.log('---> result: ', result.length);
    return result;
  }
  async delete(id: String): Promise<Profile> {
    return this.model.findByIdAndRemove(id);
  }
  async update(data: UpdateProfileInput): Promise<Profile> {
    try {
      const existingDoc = await this.model.findById(data.id);
      if (!existingDoc) {
        return null;
      }
      Object.assign(existingDoc, data);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      return null;
    }
  }
  async getProfileByCustomerId(customerId: string): Promise<Profile[]> {
    var profiles: Profile[] = [];
    const profileLoad = await this.profileLoader.load(customerId);

    return profileLoad;
  }
}
