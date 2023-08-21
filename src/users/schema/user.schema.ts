import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
@Schema({
    timestamps:true
})
export class User{
    @Prop()
    fullname: string

    @Prop()
    username: string

    @Prop()
    email: string

    @Prop()
    password: string
}
export const UserSchema = SchemaFactory.createForClass(User)