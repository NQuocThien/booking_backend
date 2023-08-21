import { InputType, Field, Int } from '@nestjs/graphql'
@InputType()
export class LoginUserInput {
    @Field()
    username: string;

    @Field()
    password: string;
}
