import { Field, InputType } from '@nestjs/graphql';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class CreateBlogInput {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field(() => LinkImageInput)
  mainPhoto: LinkImageInput;

  @Field()
  content: string;

  @Field()
  keywords: string;

  @Field()
  shortContent: string;

  @Field(() => EnumBlogStatus)
  status: EnumBlogStatus;

  @Field()
  priority: number;

  @Field(() => EnumBlogType)
  type: EnumBlogType;
}
