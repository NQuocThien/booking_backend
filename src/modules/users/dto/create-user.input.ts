import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Profile } from 'src/modules/profile/entities/profile.entity';
@ObjectType()
export class CreateUserInput {

    @Field()
    fullname: string;
 
    @Field()
    username: string;

    @Field()
    type: number;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    profile: Profile;
}

