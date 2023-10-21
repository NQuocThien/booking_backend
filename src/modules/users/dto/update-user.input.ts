import { InputType, Field, Int } from '@nestjs/graphql'
import { LinkImageInput } from './linkimage.input';
@InputType()
export class UpdateUserInput {

    @Field()
    id: string

    @Field()
    fullname: string;

    @Field()
    type: number;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    linkImage: LinkImageInput;

}
