import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CarePackage } from 'src/modules/care-package/entities/care-package.entity';

@ObjectType()
export class Register {
  @Field(() => ID)
  id: String;

  @Field()
  profileId: string;

  @Field()
  packegeId: string;

  @Field()
  date: Date;

  @Field()
  state: string;

  @Field(() => CarePackage, { nullable: true })
  carePackage: CarePackage;
}
