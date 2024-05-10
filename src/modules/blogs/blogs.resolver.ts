import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Blog } from './entities/blog.entity';
import { BlogsService } from './blogs.service';
import { UseGuards } from '@nestjs/common';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBlogInput } from './entities/dtos/create-blog.input';
import { BlogInput } from './entities/dtos/blog.input';
import { UsersService } from '../users/users.service';
import { UserSlimInput } from '../contains/user-slim/user-slim.input';
import { UpdateBlogInput } from './entities/dtos/update-blog.input';
import deleteImage from 'src/utils/delete_image';
import { EnumBlogStatus, EnumBlogType } from 'src/contain';
import { DoctorsService } from '../doctors/doctors.service';
import { MedicalStaffService } from '../medical-staff/medical-staff.service';
@Resolver(() => Blog)
export class BlogsResolver {
  constructor(
    private readonly blogSrv: BlogsService,
    private readonly userSrv: UsersService,
    private readonly doctorSrv: DoctorsService,
    private readonly stafSrv: MedicalStaffService,
  ) {}

  //====================================== --> QUERY <-- ===============================

  @Query(() => Blog, { name: 'getBlogBySlug' })
  async getBlogBySlug(
    @Args('slug')
    slug: string,
  ): Promise<Blog> {
    const blogs = await this.blogSrv.findoeBySlug(slug);
    return blogs;
  }

  @Query(() => [Blog], { name: 'getAllBlogPagination' })
  async getAllBlogPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'priority' })
    sortField: string,
    @Args('sortOrder', { nullable: true, defaultValue: 'desc' })
    sortOrder: string,
    @Args('isDeleted', { nullable: true, defaultValue: false })
    isDeleted: boolean,
  ): Promise<Blog[]> {
    const blogs = await this.blogSrv.getAllBlogPagination(
      search,
      page,
      limit,
      sortField,
      sortOrder,
      false,
      isDeleted,
    );
    return blogs;
  }

  @Query(() => [Blog], { name: 'getAllBlogOfFacilityPagination' })
  async getAllBlogOfFacilityPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'priority' })
    sortField: string,
    @Args('sortOrder', { nullable: true, defaultValue: 'desc' })
    sortOrder: string,
    @Args('isDeleted', { nullable: true, defaultValue: false })
    isDeleted: boolean,
    @Args('facilityId')
    facilityId: string,
  ): Promise<Blog[]> {
    const staffUserIds = await this.stafSrv.getAllUserMedicalStaff(facilityId);
    const doctorIds = await this.doctorSrv.findAllUserIds(facilityId);
    const ids: string[] = Array.from(new Set([...staffUserIds, ...doctorIds]));
    const usernames = await this.userSrv.getUserNameByIds(ids);
    const blogs = await this.blogSrv.getAllBlogOfFaciityPagination(
      search,
      page,
      limit,
      sortField,
      sortOrder,
      false,
      isDeleted,
      usernames,
    );
    return blogs;
  }
  @Query(() => [Blog], { name: 'getAllBlogPaginationForClient' })
  async getAllBlogPaginationForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'priority' })
    sortField: string,
    @Args('sortOrder', { nullable: true, defaultValue: 'desc' })
    sortOrder: string,
    @Args('type', { nullable: true, defaultValue: undefined })
    type: EnumBlogType,
  ): Promise<Blog[]> {
    const blogs = await this.blogSrv.getAllBlogPagination(
      search,
      page,
      limit,
      sortField,
      sortOrder,
      true,
      false,
      type,
    );
    return blogs;
  }

  @Query(() => Number, { name: 'getTotalBlogsCount' })
  async getTotalBlogsCount(
    @Args('search', { nullable: true }) search: string,
    @Args('isDeleted', { nullable: true, defaultValue: false })
    isDeleted: boolean,
  ): Promise<number> {
    const count = await this.blogSrv.getTotalBlogsCount(search, isDeleted);
    return count;
  }

  @Query(() => Number, { name: 'getTotalBlogsCountForClient' })
  async getTotalBlogsCountForClient(
    @Args('search', { nullable: true }) search: string,
    @Args('type', { nullable: true, defaultValue: undefined })
    type: EnumBlogType,
  ): Promise<number> {
    const count = await this.blogSrv.getTotalBlogsCountForClient(search, type);
    return count;
  }

  //====================================== --> MUTATION <-- ===============================
  @UseGuards(JWtAuthGuard)
  @Mutation(() => Blog, { name: 'createBlog' })
  async createBlog(
    @Args('input') input: CreateBlogInput,
    @Context() context,
  ): Promise<Blog> {
    const username = context.req.user.username;
    const isExist = await this.blogSrv.findoeBySlug(input.slug);
    if (!isExist) {
      const userSlim = await this.userSrv.getUserSlim(username);
      if (userSlim) {
        const blogInnput: BlogInput = {
          ...input,
          createdAt: Date.now(),
          createdBy: userSlim,
          deletedAt: null,
          deletedBy: null,
          updatedAt: null,
          updatedBy: null,
        };
        return await this.blogSrv.createBlog(blogInnput);
      }
    } else {
      deleteImage(input.mainPhoto, 'blogs');
    }
    throw new Error('Slug exist!');
  }

  @UseGuards(JWtAuthGuard)
  @Mutation(() => Blog, { name: 'updateBlog' })
  async updateBlog(
    @Args('input') input: UpdateBlogInput,
    @Context() context,
  ): Promise<Blog> {
    const username = context.req.user.username;
    if (input.slug) {
      const isExist = await this.getBlogBySlug(input.slug);
      if (isExist.id !== input.id) throw new Error('Slug Exist!');
    }

    const userSlim = await this.userSrv.getUserSlim(username);
    const oldBlog = await this.blogSrv.findById(input.id);
    const userSlimInput: UserSlimInput = {
      username: userSlim.username,
      role: userSlim.role,
      showName: userSlim.showName,
    };
    if (userSlim) {
      const blogInnput: UpdateBlogInput = {
        ...input,
        updatedAt: Date.now(),
        updatedBy: userSlimInput,
      };

      if (
        JSON.stringify(blogInnput.mainPhoto) !==
        JSON.stringify(oldBlog.mainPhoto)
      ) {
        console.log('--> delete old image: ', oldBlog.mainPhoto.url);
        deleteImage(oldBlog.mainPhoto, 'blogs');
      }
      return await this.blogSrv.updateBlog(blogInnput);
    }

    return null;
  }

  @UseGuards(JWtAuthGuard)
  @Mutation(() => Blog, { name: 'deleteUnDeleteBlog' })
  async deleteUnDeleteBlog(
    @Args('id') id: string,
    @Context() context,
  ): Promise<Blog> {
    const username = context.req.user.username;
    const userSlim = await this.userSrv.getUserSlim(username);
    const oldBlog = await this.blogSrv.findById(id);
    const userSlimInput: UserSlimInput = {
      username: userSlim.username,
      role: userSlim.role,
      showName: userSlim.showName,
    };
    if (userSlim) {
      if (oldBlog.status === EnumBlogStatus.Deleted)
        return await this.blogSrv.deleteUnDeleteBlog(
          undefined,
          id,
          EnumBlogStatus.NotPublic,
        );
      else
        return await this.blogSrv.deleteUnDeleteBlog(
          userSlimInput,
          id,
          EnumBlogStatus.Deleted,
        );
    }
    return null;
  }

  //====================================== --> SUBSCRIPTION <-- ===============================
}
