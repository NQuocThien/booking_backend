import { Field, InputType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class UpLoadFileRegisInput {
  @Field()
  id: string;

  @Field(() => [LinkImageInput], { nullable: true })
  files: LinkImageInput[] | undefined;
}
