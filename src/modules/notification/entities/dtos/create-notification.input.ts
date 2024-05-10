import { Field, InputType } from '@nestjs/graphql';
import { ETypeOfNotification } from 'src/contain';
@InputType()
export class CreateNotificationInput {
  @Field()
  userId: string;

  @Field()
  content?: string;

  @Field()
  detailPath: string;
}
