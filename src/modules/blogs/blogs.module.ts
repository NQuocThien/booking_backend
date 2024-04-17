import { Module } from '@nestjs/common';
import { BlogsResolver } from './blogs.resolver';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schema/blog.schema';
import { Blog } from './entities/blog.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
    UsersModule,
  ],
  providers: [BlogsResolver, BlogsService],
})
export class BlogsModule {}
