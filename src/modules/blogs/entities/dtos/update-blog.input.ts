import { Field, ID, InputType } from '@nestjs/graphql';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { UserSlimEntity } from 'src/modules/contains/user-slim/user-slim.entity';
import { UserSlimInput } from 'src/modules/contains/user-slim/user-slim.input';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';
@InputType()
export class UpdateBlogInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  slug: string;

  @Field(() => LinkImageInput, { nullable: true })
  mainPhoto: LinkImageInput;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  keywords: string;

  @Field()
  shortContent: string;

  @Field(() => EnumBlogStatus, { nullable: true })
  status: EnumBlogStatus;

  @Field({ nullable: true })
  priority: number;

  @Field(() => EnumBlogType, { nullable: true })
  type: EnumBlogType;

  @Field({ nullable: true })
  updatedAt: number;

  @Field(() => UserSlimInput, { nullable: true })
  updatedBy: UserSlimInput;

  @Field({ nullable: true })
  deletedAt: number | undefined;

  @Field(() => UserSlimInput, { nullable: true })
  deletedBy: UserSlimInput | undefined;
}
