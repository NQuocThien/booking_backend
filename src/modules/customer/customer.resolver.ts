import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './entities/dto/create-customer.input';
import { Profile } from '../profile/entity/profile.entity';
import { ProfileService } from '../profile/profile.service';
import { UpdateCustomerInput } from './entities/dto/update-customer.input';
@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly profileSv: ProfileService,
  ) {}

  @Query(() => [Customer], { name: 'getAllCustomer' })
  async getAllCustomer() {
    return this.customerService.getCustomer();
  }

  @Query(() => Number, { name: 'getTotalCustomersCount' })
  async getTotalCustomersCount(
    @Args('search', { nullable: true }) search?: string,
  ): Promise<number> {
    const count = await this.customerService.getTotalCustomersCount(
      search || '',
    );
    return count;
  }

  @Query(() => [Customer], { name: 'getAllCustomerPagination' })
  // @UseGuards(JWtAuthGuard)
  async getAllCustomerPagination(
    @Args('search', { nullable: true }) search: string,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
    @Args('sortField', { nullable: true, defaultValue: 'name' })
    sortField: string,
    @Args('sortOrder', { nullable: true }) sortOrder: string,
  ): Promise<Customer[]> {
    {
      const user = await this.customerService.getAllCustomerPagination(
        search,
        page,
        limit,
        sortField,
        sortOrder,
      );
      return user;
    }
  }

  @Mutation(() => Customer, { name: 'createCustomer' })
  async createCustomer(@Args('input') input: CreateCustomerInput) {
    const oldCustomer = await this.customerService.findByUserId(input.userId);
    // console.log(input);
    if (!oldCustomer && input.userId !== '') {
      return this.customerService.createCustomer(input);
    }
    return null;
  }
  @Mutation(() => Customer, { name: 'updateCustomer' })
  async updateCustomer(@Args('input') input: UpdateCustomerInput) {
    return this.customerService.updateCustomer(input);
  }

  @ResolveField(() => [Profile], { name: 'profiles' })
  async profiles(@Parent() cus: Customer): Promise<Profile[]> {
    // console.log('=> Customer: ', cus.name);
    return this.profileSv.getProfileByCustomerId(cus.id);
  }
}
