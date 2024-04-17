import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { UserSlimEntity } from 'src/modules/contains/user-slim/user-slim.entity';
import { UserSlimInput } from 'src/modules/contains/user-slim/user-slim.input';
import { LinkImage } from 'src/modules/users/dto/image';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class BlogInput {
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

  @Field()
  status: EnumBlogStatus;

  @Field()
  priority: number;

  @Field()
  type: EnumBlogType;

  @Field()
  createdAt: number;

  @Field(() => UserSlimInput)
  createdBy: UserSlimInput;

  @Field()
  updatedAt: number;

  @Field(() => UserSlimInput)
  updatedBy: UserSlimInput;

  @Field()
  deletedAt: number;

  @Field(() => UserSlimInput)
  deletedBy: UserSlimInput;
}
