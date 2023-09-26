import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Profile } from 'src/modules/profile/entities/profile.entity'
@Schema({
    timestamps: true
})
export class User {
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

    @Prop(() => [String])
    roles: string[]

    @Prop({ nullable: true })
    profile: Profile

}
export const UserSchema = SchemaFactory.createForClass(User)