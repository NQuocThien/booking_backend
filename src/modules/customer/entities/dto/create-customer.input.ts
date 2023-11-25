import { Field, InputType } from '@nestjs/graphql';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class CreateCustomerInput {
  @Field()
  fullname: string;

  @Field()
  userId: string;
}
