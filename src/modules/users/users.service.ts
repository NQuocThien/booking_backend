import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model } from 'mongoose';
import { User } from './entities/user.entity';
import { log } from 'console';
import { CustomerService } from '../customer/customer.service';
// import { ProfileService } from '../profile/profile.service';
// import { CreateProfileInput } from '../profile/dto/create-profile.input';
// import { User } from './schema/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>, // private profileService: ProfileService
    private cusSv: CustomerService,
  ) {}
  async create(
    createUserInput: CreateUserInput,
    fullname: string,
  ): Promise<User> {
    const user = await this.userModel.create({ ...createUserInput });
    log('---> Created New User With ID: ', user.id);
    // create customer
    await this.cusSv.createCustomer({ fullname: fullname, userId: user.id });
    return user;
  }

  async findAll(): Promise<[User]> {
    // bảo vệ bởi jwt
    // console.log(' user: ', this.userModel.find())
    var users: any;
    await this.userModel
      .find()
      .then((data) => (users = data))
      .catch((err) => new Error(err));
    // console.log('test id:', users)
    return users;
  }
  async getUserMedicalNon(): Promise<[User]> {
    // bảo vệ bởi jwt
    // console.log(' user: ', this.userModel.find())
    var users: any;
    await this.userModel
      .find({ medicalFacilities: { $exists: false, $eq: null } })
      .then((data) => (users = data))
      .catch((err) => new Error(err));
    // console.log('test id:', users)
    return users;
  }

  async findOne(username: string): Promise<User> {
    const user: User = await this.userModel.findOne({ username: username });

    return user;
  }

  async updateUserById(updateUserInput: UpdateUserInput): Promise<User> {
    const { id, ...userBody } = updateUserInput;
    const userUpdated = await this.userModel.findByIdAndUpdate(
      updateUserInput.id,
      userBody,
      { new: true },
    );
    log('----> User input:', updateUserInput);
    log('----> User Updated:', userUpdated);

    return userUpdated;
  }

  async deleteUserById(id: string): Promise<User> {
    // log('user input 1: ', userBody)
    const userDeleted = await this.userModel.findByIdAndRemove(id);
    log('----> User Deleted:', userDeleted.id);
    return userDeleted;
  }
  async updateRoles(id: string, newRoles: string[]): Promise<User> {
    // log('user input 1: ', userBody)
    const userUpdated = await this.userModel.findByIdAndUpdate(
      id,
      { roles: newRoles },
      { new: false },
    );
    log('----> User Update Roles:', userUpdated.id);
    return userUpdated;
  }
  async activeUserById(id: string): Promise<User> {
    // log('user input 1: ', userBody)
    var userHandled: any;
    const user: User = await this.userModel.findById(id);
    if (user.active)
      userHandled = await this.userModel.findByIdAndUpdate(
        id,
        { active: false },
        { new: true },
      );
    else
      userHandled = await this.userModel.findByIdAndUpdate(
        id,
        { active: true },
        { new: true },
      );
    return userHandled;
  }
}
