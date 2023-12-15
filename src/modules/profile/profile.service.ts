import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entity/profile.entity';
import { Model } from 'mongoose';
import { CreateProfileInput } from './entity/dtos/create-profile.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly model: Model<Profile>,
  ) {}
  async create(profile: CreateProfileInput): Promise<Profile> {
    return this.model.create(profile);
  }
  async getProfileByCustomerId(customerId: String): Promise<Profile[]> {
    return this.model.find({ customerId: customerId });
  }
}
