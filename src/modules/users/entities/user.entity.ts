import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { ObjectId } from 'mongodb';
import { Profile } from 'src/modules/profile/entities/profile.entity';
@ObjectType()
export class User {

    @Field(type => ID)
    id: String

    @Field({ nullable: false })
    fullname: string;

    @Field()
    type: number;

    @Field(() => [String], { nullable: true })
    roles?: string[];

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    profile: Profile;

}
