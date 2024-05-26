import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Exception } from '../exception/exception.entityt';

@ObjectType()
export class Session {
  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => [Exception], { nullable: true, defaultValue: null })
  exceptions: Exception[];
}
