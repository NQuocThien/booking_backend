import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { ObjectId } from 'mongodb';
import { Profile } from 'src/modules/profile/entities/profile.entity';
@ObjectType()
export class User {

    @Field(type => ID)
    id: ObjectId;

    @Field({ nullable: false })
    fullname: string;

    @Field()
    type: number;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    profile: Profile;

}
