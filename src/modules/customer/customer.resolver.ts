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
  ) // private readonly profileSv: ProfileService,
  {}

  @Query(() => [Customer], { name: 'getAllCustomer' })
  async getAllCustomer() {
    return this.customerService.getCustomer();
  }

  @Mutation(() => Customer, { name: 'createcustomer' })
  async createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.customerService.createCustomer(input);
  }
  @Mutation(() => Customer, { name: 'updateCustomer' })
  async updateCustomer(@Args('input') input: UpdateCustomerInput) {
    return this.customerService.updateCustomer(input);
  }

  // @ResolveField(() => [Profile], { name: 'profile' })
  // async profile(@Parent() cus: Customer): Promise<Profile[]> {
  //   return this.profileSv.getProfileByCustomerId(cus.id);
  // }
}
