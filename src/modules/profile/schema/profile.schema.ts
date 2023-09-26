import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
@Schema({
    timestamps: true
})
export class Profile {
    @Prop({ nullable: true })
    introduce: string

    @Prop()
    userId: string

    @Prop({ nullable: true })
    skills: string

    // @Prop(() => [User])
    // user: User[]
}
export const ProfileSchema = SchemaFactory.createForClass(Profile)