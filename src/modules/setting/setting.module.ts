import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingResolver } from './setting.resolver';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting } from './entities/setting.entity';
import { SettingSchema } from './shemas/setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Setting.name,
        schema: SettingSchema
      }
    ]),
  ],
  providers: [SettingResolver, SettingService],
})
export class SettingModule {}
