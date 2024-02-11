import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EGender } from 'src/contain';
import { Profile } from 'src/modules/profile/entity/profile.entity';
@ObjectType()
export class Customer {
  @Field(() => ID)
  id: String;

  @Field()
  userId: string;

  @Field()
  name: String;

  @Field()
  gender: EGender;

  @Field()
  numberPhone: String;

  @Field()
  email: String;

  @Field()
  address: String;

  @Field()
  dateOfBirth: Date;

  @Field()
  nation: String;

  @Field(() => [Profile], { nullable: true })
  profile: Profile[];
}
