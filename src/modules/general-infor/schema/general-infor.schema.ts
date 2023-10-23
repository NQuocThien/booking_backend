import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { LinkImage } from 'src/modules/users/schema/linkImage.schema'
@Schema({
    timestamps: true
})
export class GeneralInfor {
    @Prop()
    company: string

    @Prop({
        type: Object,
        default: null,
    })
    logoHeader: LinkImage

    @Prop({
        type: Object,
        default: null,
    })
    logoFooter: LinkImage

    @Prop()
    hotline: string

    @Prop()
    email: string

    @Prop()
    address: string

    @Prop()
    liscenceBusiness: string

    @Prop()
    liscenceOparating: string

    @Prop()
    copyrigth: string

    @Prop({ nullable: true })
    ID: string
}
export const GeneralInforSchema = SchemaFactory.createForClass(GeneralInfor)