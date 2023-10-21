import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
enum Etype {
    document = 'document',
    image = 'image',
}
registerEnumType(Etype, {
    name: 'Etype',
});
@ObjectType()
export class LinkImage {
    @Field()
    filename: string;

    @Field()
    type: string;

    @Field()
    url: string;
}
