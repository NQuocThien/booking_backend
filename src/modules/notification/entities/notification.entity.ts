import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ETypeOfNotification } from 'src/contain';
registerEnumType(ETypeOfNotification, {
  name: 'ETypeOfNotification',
});
@ObjectType()
export class Notification {
  @Field(() => ID)
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
