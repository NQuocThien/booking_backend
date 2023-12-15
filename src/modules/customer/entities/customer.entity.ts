import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Profile } from 'src/modules/profile/entity/profile.entity';
@ObjectType()
export class Customer {
  @Field(() => ID)
  id: String;

  @Field({ nullable: true })
  fullname: string;

  @Field()
  userId: string;

  @Field(() => [Profile])
  profile: Profile[];
}
