import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './entities/blog.entity';
import { Model } from 'mongoose';
import { BlogInput } from './entities/dtos/blog.input';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { UpdateBlogInput } from './entities/dtos/update-blog.input';
import { UserSlimInput } from '../contains/user-slim/user-slim.input';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
  ) {}
  //======================= ---> GET <--- =========================

  async findoeBySlug(slug: string) {
    return await this.blogModel.findOne({ slug: slug }).exec();
  }

  async findById(id: string) {
    return await this.blogModel.findById(id).exec();
  }

  async getAllBlogPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    isClient: boolean,
    isDeleted: boolean = false,
    type: EnumBlogType = undefined,
  ): Promise<Blog[]> {
    const query: any = {};
    if (isDeleted) {
      query.status = { $eq: EnumBlogStatus.Deleted };
    } else query.status = { $ne: EnumBlogStatus.Deleted };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (isClient) query.status = { $eq: EnumBlogStatus.Public };
    if (type) query.type = { $eq: type };
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.blogModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }

  async getAllBlogOfFaciityPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    isClient: boolean,
    isDeleted: boolean = false,
    usernames: string[],
  ): Promise<Blog[]> {
    const query: any = {
      'createdBy.username': { $in: usernames },
    };
    if (isDeleted) {
      query.status = { $eq: EnumBlogStatus.Deleted };
    } else query.status = { $ne: EnumBlogStatus.Deleted };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (isClient) query.status = { $eq: EnumBlogStatus.Public };
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.blogModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }
  async getTotalBlogsCount(
    search: string,
    isDeleted: boolean,
  ): Promise<number> {
    const query: any = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (isDeleted) query.status = { $eq: EnumBlogStatus.Deleted };
    else query.status = { $ne: EnumBlogStatus.Deleted };
    return this.blogModel.countDocuments(query);
  }
  async getTotalBlogsCountForClient(
    search: string,
    type: EnumBlogType | undefined,
  ): Promise<number> {
    const query: any = {};
    query.status = { $eq: EnumBlogStatus.Public };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (type) query.type = { $eq: type };
    return this.blogModel.countDocuments(query);
  }

  //======================= ---> UPDATE <--- =========================

  async createBlog(blogInput: BlogInput): Promise<Blog> {
    return this.blogModel.create(blogInput);
  }

  async updateBlog(blogInput: UpdateBlogInput): Promise<Blog> {
    const { id, ...inputUpdate } = blogInput;
    return this.blogModel
      .findByIdAndUpdate(id, inputUpdate, { new: true })
      .exec();
  }
  async deleteUnDeleteBlog(
    userSlimInput: UserSlimInput | undefined,
    id: string,
    status: EnumBlogStatus,
  ): Promise<Blog> {
    return this.blogModel
      .findByIdAndUpdate(
        id,
        { status: status, deletedBy: userSlimInput },
        { new: true },
      )
      .exec();
  }
}
