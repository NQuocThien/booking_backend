import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './entities/dto/create-customer.input';
@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

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
}
