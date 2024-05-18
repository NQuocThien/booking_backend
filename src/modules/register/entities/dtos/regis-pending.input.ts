import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ETypeOfService } from 'src/contain';
@InputType()
export class RegisPendingInput {
  @Field(() => [String])
  doctorIds: string[];

  @Field(() => [String])
  packageIds: string[];

  @Field(() => [String])
  vaccineIds: string[];

  @Field(() => [String])
  specialtyIds?: string[];

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => ETypeOfService, { nullable: true, defaultValue: undefined })
  typeOfService: ETypeOfService | undefined;

  @Field()
  cancel: boolean;
}
