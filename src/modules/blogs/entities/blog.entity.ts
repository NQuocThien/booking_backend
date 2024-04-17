import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { UserSlimEntity } from 'src/modules/contains/user-slim/user-slim.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Blog {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field(() => LinkImage)
  mainPhoto: LinkImage;

  @Field(() => String)
  shortContent: string;

  @Field()
  content: string;

  @Field()
  keywords: string;

  @Field()
  status: EnumBlogStatus;

  @Field()
  priority: number;

  @Field()
  type: EnumBlogType;

  @Field()
  createdAt: number;

  @Field(() => UserSlimEntity)
  createdBy: UserSlimEntity;

  @Field({ nullable: true })
  updatedAt: number;

  @Field(() => UserSlimEntity, { nullable: true })
  updatedBy: UserSlimEntity;

  @Field({ nullable: true })
  deletedAt: number | undefined;

  @Field(() => UserSlimEntity, { nullable: true })
  deletedBy: UserSlimEntity | undefined;
}
