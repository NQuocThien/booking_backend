import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ETypeOfService } from 'src/contain';
@InputType()
export class GetRegisPendingInput {
  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => String, { nullable: true })
  facilityIdFromStaff: string;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => ETypeOfService, { nullable: true, defaultValue: undefined })
  typeOfService: ETypeOfService | undefined;

  @Field()
  cancel: boolean;
}
