import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
// import { User } from './schema/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ){
    // console.log('user: ', User.name)
  }
  // private readonly users = [
  //   {
  //     username:'admin',
  //     password: '0000'
  //   },
  //   {
  //     username:'admin2',
  //     password: '0000'
  //   },
  //   {
  //     username:'admin3',
  //     password: '0000'
  //   },
  // ]

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userModel.create({...createUserInput})
    return user;
  }

  async findAll(): Promise<[User]> { // bảo vệ bởi jwt
    // console.log('test 2: ', this.userModel.find({}))
    return await this.userModel.find({}).lean();
  }

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({username: username});
  }
}
