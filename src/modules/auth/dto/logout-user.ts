import { InputType, Field, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class LogoutUser{
    @Field()
    logout: boolean
}