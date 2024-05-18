import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { CustomerService } from '../customer/customer.service';
import { Profile } from './entity/profile.entity';
import { CreateProfileInput } from './entity/dtos/create-profile.input';
import { UpdateProfileInput } from './entity/dtos/update-profile.input';
import { RegisterService } from '../register/register.service';
import { Register } from '../register/entities/register.entity';
import { Customer } from '../customer/entities/customer.entity';
import { ProfileLoaderService } from './profile-loader.service';
import { RegisterLoaderService } from '../register/register-loader.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationResolver } from '../notification/notification.resolver';
import { CreateNotificationInput } from '../notification/entities/dtos/create-notification.input';
import { EStateRegister } from 'src/contain';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly regisService: RegisterService,
    private readonly customerSvr: CustomerService,
    private readonly profileLoader: ProfileLoaderService,
    private readonly notificationResolver: NotificationResolver,
    private readonly registeredSrvLoader: RegisterLoaderService,
  ) {}
  // =================================================================>>>  QUERY

  @Query(() => [Profile], { name: 'getProfileByCustomerId' })
  async getProfileByCustomerId(@Args('id') id: string): Promise<Profile[]> {
    const result = await this.profileService.getProfileByCustomerId(id);
    return result;
  }

  @Query(() => [Profile], { name: 'getProfileByCustomerKey' })
  async getProfileByCustomerKey(
    @Args('customerKey') customerKey: string,
  ): Promise<Profile[]> {
    const result =
      await this.profileService.getProfileByCustomerKey(customerKey);
    return result;
  }
  @Query(() => Profile, { name: 'getProfileById' })
  async getProfileById(@Args('id') id: string): Promise<Profile> {
    const result = await this.profileService.getProfileById(id);
    return result;
  }
  @Query(() => [Profile], { name: 'getAllProfile' })
  async getAllProfile(): Promise<Profile[]> {
    const result = await this.profileService.findAll();
    return result;
  }
  @Query(() => Profile, { name: 'getProfiles' })
  async getProfiles(@Args('id') id: string) {
    const result = await this.profileLoader.load(id);
    return result;
  }
  // =================================================================>>>  MUTATION
  @Mutation(() => Profile, { name: 'deleteProfile' })
  async delete(@Args('id') id: String): Promise<Profile> {
    return this.profileService.delete(id);
  }

  @Mutation(() => Profile, { name: 'createProfile' })
  async create(@Args('input') input: CreateProfileInput): Promise<Profile> {
    return this.profileService.create(input);
  }

  @Mutation(() => Profile, { name: 'updateProfile' })
  async update(@Args('input') input: UpdateProfileInput): Promise<Profile> {
    return this.profileService.update(input);
  }

  @Mutation(() => Profile, { name: 'shareProfile' })
  async shareProfile(
    @Args('profileId') profileId: string,
    @Args('customerKey') customerKey: string,
  ): Promise<Profile> {
    const profileShare = await this.profileService.shareProfile(
      profileId,
      customerKey,
    );
    const customerFrom = await this.customerSvr.findCustomerById(
      profileShare?.customerId,
    );
    const customerTo = await this.customerSvr.findByCustomerKey(customerKey);

    const notificationFrom: CreateNotificationInput = {
      userId: (await customerFrom).userId,
      detailPath: '',
      content: `Bạn đã chia sẽ hồ sơ "${profileShare?.fullname}" cho ${
        (await customerTo).fullname
      }`,
    };
    const notificationTo: CreateNotificationInput = {
      userId: (await customerTo).userId,
      detailPath: '/account/profile',
      content: `Bạn đã được chia sẽ hồ sơ "${profileShare?.fullname}" bởi  ${
        (await customerFrom).fullname
      }`,
    };
    this.notificationResolver.createNotification(notificationFrom);
    this.notificationResolver.createNotification(notificationTo);
    return profileShare;
  }
  // =================================================================>>>  RESOLVE FIELD
  @ResolveField(() => [Register], { name: 'register' })
  async register(
    @Parent() profile: Profile,
    @Args('stateRegis', { nullable: true, defaultValue: undefined })
    stateRegis: EStateRegister,
    @Args('cancel', { nullable: true, defaultValue: undefined })
    cancel: boolean,
  ): Promise<Register[]> {
    const data = await this.registeredSrvLoader.load(profile.id);
    var result: Register[];
    var dataSorted = data.sort((r1, r2) => {
      const time1 = new Date(r1.createdAt);
      const time2 = new Date(r2.createdAt);
      return time2.getTime() - time1.getTime();
    }); // sắp xếp theo thời gian tạo
    result = dataSorted;
    if (stateRegis !== undefined) {
      const dataFilterState = result.filter((r) => r.state === stateRegis);
      result = dataFilterState;
      // console.log('test stateRegis: ', stateRegis);
    }
    if (cancel !== undefined) {
      const dataFilterCanncel = result.filter((r) => r.cancel === cancel);
      result = dataFilterCanncel;
      console.log('test cancel: ', cancel);
    }
    return result;
  }
  @ResolveField(() => Customer, { name: 'customer' })
  async customer(@Parent() profile: Profile): Promise<Customer | null> {
    if (profile.customerId) {
      const customer = await this.customerSvr.findById(profile.customerId);
      return customer || null;
    }
    return null;
  }
}
