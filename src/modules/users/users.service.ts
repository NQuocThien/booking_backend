import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel} from '@nestjs/mongoose'
import { FlattenMaps, Model } from 'mongoose';
import { User } from './entities/user.entity';
// import { User } from './schema/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ){
  }
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userModel.create({...createUserInput})
    return user;
  }

  async findAll(): Promise<[User]> { // bảo vệ bởi jwt
    // console.log(' user: ', this.userModel.find())
    var users: any
    await this.userModel.find().lean()
    .then( data=> users = data)
    .catch(err => new Error(err))

    return users ;
  }

  async findOne(username: string): Promise<User> {
    const user:User = await this.userModel.findOne({username: username})
    return user ;
  }
}
