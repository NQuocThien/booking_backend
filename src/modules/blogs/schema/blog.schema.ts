import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { UserSlimEntity } from 'src/modules/contains/user-slim/user-slim.entity';
import { UserSlim } from 'src/modules/contains/user-slim/user-slim.schema';
import { LinkImage } from 'src/modules/users/dto/image';
@Schema({
  timestamps: true,
})
export class Blog {
  @Prop()
  title: string;

  @Prop()
  slug: string;

  @Prop(() => LinkImage)
  mainPhoto: LinkImage;

  @Prop()
  shortContent: string;

  @Prop()
  content: string;

  @Prop()
  keywords: string;

  @Prop()
  status: EnumBlogStatus;

  @Prop()
  priority: number;

  @Prop()
  type: EnumBlogType;

  @Prop({ required: true, default: Date.now })
  createdAt: number;

  @Prop({ required: true, type: UserSlim })
  createdBy: UserSlim;

  @Prop()
  updatedAt: number;

  @Prop({ type: UserSlim })
  updatedBy: UserSlim;

  @Prop()
  deletedAt: number;

  @Prop({ type: UserSlim })
  deletedBy: UserSlimEntity;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
