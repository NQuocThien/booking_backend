// import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
enum Etype {
    document = 'document',
    image = 'image',
}
// registerEnumType(Etype, {
//     name: 'Etype',
// });
@Schema()
export class LinkImage {
    @Prop()
    filename: string;

    @Prop()
    type: string;

    @Prop()
    url: string;
}
