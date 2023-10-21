import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose';
import { Profile } from 'src/modules/profile/entities/profile.entity'
import { LinkImage } from './linkImage.schema';

@Schema({
    timestamps: true
})
export class User {
    // @Prop({ type: mongoose.Schema.Types.ObjectId }) // Sử dụng kiểu dữ liệu của Mongoose
    // id: mongoose.Types.ObjectId;

    @Prop()
    fullname: string

    @Prop()
    username: string

    @Prop()
    email: string

    @Prop()
    password: string

    @Prop()
    type: number

    @Prop(
        {
            type: Object,
            default: null,
        }
    )
    linkImage: LinkImage

    @Prop(() => [String])
    roles: string[]

    @Prop({ nullable: true })
    profile: Profile

}
export const UserSchema = SchemaFactory.createForClass(User)