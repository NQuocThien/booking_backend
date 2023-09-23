import { Injectable } from '@nestjs/common';
import { CreateSettingInput } from './dto/create-setting.input';
import { UpdateSettingInput } from './dto/update-setting.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './entities/setting.entity';
import { log } from 'console';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name)
    private settingModel: Model<Setting>
  ){

  }

  async findOne() {
    // log('test ')
    return await this.settingModel.findOne({ id: 'default' }).lean();
  }

  update(id: number, updateSettingInput: UpdateSettingInput) {
    return `This action updates a #${id} setting`;
  }

}
