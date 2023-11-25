import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './entities/dto/create-customer.input';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
  ) {}
  async getCustomer() {
    return this.customerModel.find();
  }
  async findCustomerById(userId: String) {
    return this.customerModel.findOne({ userId: userId });
  }
  async createCustomer(createCustomerInput: CreateCustomerInput) {
    return this.customerModel.create(createCustomerInput);
  }
}
