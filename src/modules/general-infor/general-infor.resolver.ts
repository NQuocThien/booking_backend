import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GeneralInforService } from './general-infor.service';
import { GeneralInforUpdateInput } from './dto/general-infor-update.input';
import { GeneralInforOutput } from './dto/general-infor.output';
import { GeneralInfor } from './entities/general-infor.entity';
import { LinkImage } from '../users/dto/image';
import { promises as fsPromises } from 'fs';
// import { NotFoundException, UseGuards } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JWtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import deleteImage from 'src/utils/delete_image';
// import { Query } from '@nestjs/common';
@Resolver()
export class GeneralInforResolver {
  constructor(private readonly GeneralInforService: GeneralInforService) {}

  @Query(() => GeneralInfor, { name: 'getGeneralInfor' })
  async getGeneralInfor() {
    const infor = await this.GeneralInforService.getGeneralInfor();
    return infor;
  }
  @Mutation(() => GeneralInfor, { name: 'updateGeneralInfor' })
  @UseGuards(JWtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateGeneralInfor(
    @Args('updateGeneralInforInput')
    updateGeneralInforInput: GeneralInforUpdateInput,
  ) {
    try {
      const generalInfor = await this.getGeneralInfor();
      updateGeneralInforInput.logoFooter &&
        deleteImage(generalInfor.logoFooter);
      updateGeneralInforInput.logoHeader &&
        deleteImage(generalInfor.logoHeader);
    } catch {}
    const infor = await this.GeneralInforService.updateGeneralInfor(
      updateGeneralInforInput,
    );
    return infor;
  }
}
