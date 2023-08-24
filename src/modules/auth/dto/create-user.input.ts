import { InputType, Field, Int } from '@nestjs/graphql'
@InputType()
export class CreateUserInput {
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
