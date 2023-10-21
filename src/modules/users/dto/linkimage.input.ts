import { Field, InputType, registerEnumType } from '@nestjs/graphql'
enum Etype {
    document = 'document',
    image = 'image',
}
registerEnumType(Etype, {
    name: 'Etype',
});
@InputType()
export class LinkImageInput {
    @Field()
    filename: string;

    @Field()
    type: string;

    @Field()
    url: string;
}
