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
@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly profileSv: ProfileService,
  ) {}

  @Query(() => [Customer], { name: 'getcustomers' })
  async getCustomer() {
    return this.customerService.getCustomer();
  }

  @Mutation(() => Customer, { name: 'createcustomer' })
  async createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
    return this.customerService.createCustomer(createCustomerInput);
  }

  @ResolveField(() => [Profile], { name: 'profile' })
  async profile(@Parent() cus: Customer): Promise<Profile[]> {
    return this.profileSv.getProfileByCustomerId(cus.id);
  }
}
