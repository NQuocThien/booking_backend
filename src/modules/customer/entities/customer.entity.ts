import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EGender } from 'src/contain';
import { Profile } from 'src/modules/profile/entity/profile.entity';
@ObjectType()
export class Customer {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  name: string;

  @Field(() => String)
  gender: EGender;

  @Field()
  numberPhone: string;

  @Field()
  email: string;

  @Field()
  address: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  ethnic: string;

  @Field(() => [Profile], { nullable: true })
  profiles: Profile[];
}
