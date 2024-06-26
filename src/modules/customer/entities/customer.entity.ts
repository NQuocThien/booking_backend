import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EGender } from 'src/contain';
import { Blocks } from 'src/modules/contains/blocks/blocks.entityt';
import { Profile } from 'src/modules/profile/entity/profile.entity';
@ObjectType()
export class Customer {
  @Field(() => ID)
  id: string;

  @Field()
  customerKey: string;

  @Field()
  userId: string;

  @Field()
  fullname: string;

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

  // @Field(() => [Blocks], { nullable: true })
  // blocks: Blocks[];

  @Field(() => [Profile], { nullable: true })
  profiles: Profile[];

  @Field(() => [Profile], { nullable: true })
  profileShares: Profile[];
}
