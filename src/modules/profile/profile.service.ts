import { Injectable } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { Model } from 'mongoose';
import { Profile } from './entities/profile.entity';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>
  ) { }

  async create(createProfileInput: CreateProfileInput): Promise<Profile> {
    // console.log('create profile', createProfileInput)
    const profile: Profile = await this.profileModel.create(createProfileInput)
    log('---> Created New Profile With ID: ', (await this.profileModel.create(createProfileInput)).id, 'Of User ID:', profile.userId);
    return profile;
  }

  async findOneByUserId(id: String): Promise<Profile> {
    // log('test 3:', await this.profileModel.findOne({userId: id}))
    return await this.profileModel.findOne({ userId: id });
  }

  async getAllProfile() {
    return await this.profileModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileInput: UpdateProfileInput) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
