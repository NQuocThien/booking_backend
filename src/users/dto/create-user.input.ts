import { ObjectType, Field, Int } from '@nestjs/graphql'
@ObjectType()
export class CreateUserInput {

    @Field()
    fullname: string;
 
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

