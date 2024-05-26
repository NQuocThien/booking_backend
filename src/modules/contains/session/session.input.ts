import { Field, InputType } from '@nestjs/graphql';
import { ExceptionInput } from '../exception/exception.input';

@InputType()
export class SessionInput {
  @Field(() => String)
  startTime: String;

  @Field(() => String)
  endTime: String;

  @Field(() => [ExceptionInput], { nullable: true })
  exceptions?: ExceptionInput[];
}
