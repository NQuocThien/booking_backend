import { Field, InputType } from '@nestjs/graphql';
import { EStatusService, ETypeOfFacility } from 'src/contain';
import { Blocks } from 'src/modules/contains/blocks/blocks.entityt';
import { CreateBlockInput } from 'src/modules/contains/blocks/blocks.input';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class BlockCustomerInput {
  @Field()
  id: string;

  @Field(() => CreateBlockInput)
  block: CreateBlockInput;
}
