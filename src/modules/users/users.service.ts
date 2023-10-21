import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose'
import { FlattenMaps, Model } from 'mongoose';
import { User } from './entities/user.entity';
import { log } from 'console';
import { ProfileService } from '../profile/profile.service';
import { CreateProfileInput } from '../profile/dto/create-profile.input';
// import { User } from './schema/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private profileService: ProfileService
  ) {
  }
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userModel.create({ ...createUserInput })
    const createProfile: CreateProfileInput = new CreateProfileInput()
    createProfile.userId = user.id;
    // log('---> input:', CreateUserInput);
    log('---> Created New User With ID: ', user.id);
    this.profileService.create(createProfile)
    return user;
  }

  async findAll(): Promise<[User]> { // bảo vệ bởi jwt
    // console.log(' user: ', this.userModel.find())
    var users: any
    await this.userModel.find()
      .then(data => users = data)
      .catch(err => new Error(err))
    // console.log('test id:', users)
    return users;
  }

  async findOne(username: string): Promise<User> {
    const user: User = await this.userModel.findOne({ username: username })

    return user;
  }

  async updateUserById(updateUserInput: UpdateUserInput): Promise<User> {
    const { id, ...userBody } = updateUserInput
    const userUpdated = await this.userModel.findByIdAndUpdate(updateUserInput.id, userBody)
    log('----> User input:', updateUserInput)
    log('----> User Updated:', userUpdated.id)
    return userUpdated
  }

  async deleteUserById(id: string): Promise<User> {
    // log('user input 1: ', userBody)
    const userDeleted = await this.userModel.findByIdAndRemove(id)
    log('----> User Deleted:', userDeleted.id)
    return userDeleted
  }
}
