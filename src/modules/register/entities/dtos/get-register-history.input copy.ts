import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';

@InputType()
export class GetRegisHistoryInput {
  @Field(() => [String], { nullable: true })
  doctorIds?: string[];

  @Field(() => [String], { nullable: true })
  packageIds?: string[];

  @Field(() => [String], { nullable: true })
  vaccineIds?: string[];

  @Field(() => [String], { nullable: true })
  specialtyIds?: string[];

  @Field()
  profileId: string;
}
