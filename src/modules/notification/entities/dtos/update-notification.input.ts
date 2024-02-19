import { Field, InputType } from '@nestjs/graphql';
import { ETypeOfNotification } from 'src/contain';
@InputType()
export class UpdateNotificationInput {
  @Field()
  id: String;

  @Field()
  userId: string;

  @Field()
  content?: string;

  @Field()
  detailPath: String;

  @Field(() => ETypeOfNotification)
  status: ETypeOfNotification;
}
