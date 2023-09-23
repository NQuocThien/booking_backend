import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
@Schema({
    timestamps:true
})
export class Setting{
    @Prop()
    defaultLang: string
}
export const SettingSchema = SchemaFactory.createForClass(Setting)