import { ObjectType, Field } from '@nestjs/graphql';
import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class GeneralInfor {

    @Field()
    company: string

    @Field()
    logoHeader: LinkImage

    @Field()
    logoFooter: LinkImage

    @Field()
    hotline: string

    @Field()
    email: string

    @Field()
    address: string

    @Field()
    liscenceBusiness: string

    @Field()
    liscenceOparating: string

    @Field()
    copyrigth: string

    @Field({ nullable: true })
    ID: string
}
export const GeneralInforSchema = new mongoose.Schema(GeneralInfor)