import { InputType, Field, Int } from '@nestjs/graphql'
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

    @Field()
    password: string;
}
