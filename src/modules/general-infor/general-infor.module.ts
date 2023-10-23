import { Module } from '@nestjs/common';
import { GeneralInforResolver } from './general-infor.resolver';
import { GeneralInforService } from './general-infor.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { GeneralInfor, GeneralInforSchema } from './entities/general-infor.entity';
import { GeneralInfor, GeneralInforSchema } from './schema/general-infor.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: GeneralInfor.name,
      schema: GeneralInforSchema
    }
  ]),
  ],
  providers: [GeneralInforResolver, GeneralInforService],
  exports: [GeneralInforService]
})
export class GeneralInforModule { }
