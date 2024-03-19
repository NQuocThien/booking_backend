import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { log } from 'console';
import { CustomerService } from '../customer/customer.service';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>, // private readonly profileService: ProfileService
    private readonly cusSv: CustomerService, // private readonly doctorSvr: DoctorsService,
  ) {}
  async create(
    createUserInput: CreateUserInput,
    fullname: string,
  ): Promise<User> {
    const user = await this.userModel.create({ ...createUserInput });
    log('---> Created New User With ID:', user.id);
    // create customer
    await this.cusSv.createCustomer({
      name: fullname,
      userId: user.id,
      gender: undefined,
      numberPhone: undefined,
      email: undefined,
      address: undefined,
      dateOfBirth: undefined,
      ethnic: undefined,
    });
    return user;
  }
  async createByAdmin(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userModel.create({ ...createUserInput });
    log('---> Created New User With ID: ', user.id);
    return user;
  }

  async findAll(): Promise<[User]> {
    var users: any;
    await this.userModel
      .find()
      .then((data) => (users = data))
      .catch((err) => new Error(err));
    return users;
  }

  async findOneById(id: String): Promise<User> {
    const user = await this.userModel.findById(id);
    return user;
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
  // Trong UserService hoặc nơi cần thực hiện truy vấn
  async getAllUsersPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
  ): Promise<User[]> {
    const query = search ? { username: { $regex: search, $options: 'i' } } : {};
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.userModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }

  async getTotalUsersCount(search: string): Promise<number> {
    const query = search
      ? { username: { $regex: new RegExp(search, 'i') } }
      : {};
    const count = await this.userModel.countDocuments(query);
    return count;
  }
}
