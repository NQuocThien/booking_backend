import { Injectable } from '@nestjs/common';
import { GeneralInfor } from './entities/general-infor.entity';
// import { GeneralInfor } from './schema/general-infor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeneralInforUpdateInput } from './dto/general-infor-update.input';
@Injectable()
export class GeneralInforService {
    constructor(
        @InjectModel(GeneralInfor.name)
        private readonly generalInforModel: Model<GeneralInfor>
    ) { }
    async getGeneralInfor(): Promise<GeneralInfor> {
        const res = await this.generalInforModel.findOne({ ID: 'webbooking' })
        return res
    }
    async updateGeneralInfor(input: GeneralInforUpdateInput): Promise<GeneralInfor> {
        const res = await this.generalInforModel.findOneAndUpdate({ ID: 'webbooking' }, input)
        return res
    }
}
