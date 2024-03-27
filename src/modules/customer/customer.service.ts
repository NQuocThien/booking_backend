import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './entities/dto/create-customer.input';
import { UpdateCustomerInput } from './entities/dto/update-customer.input';
import * as DataLoader from 'dataloader';
@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
  ) {
    this.initCustomerLoader();
  }
  private customerLoader: DataLoader<string, Customer>;

  private async initCustomerLoader(): Promise<void> {
    const allCustomers = await this.customerModel.find();
    const customerMap = new Map<string, Customer>(
      allCustomers.map((customer) => [customer.id.toString(), customer]),
    );

    this.customerLoader = new DataLoader<string, Customer>(
      async (customerIds) =>
        customerIds.map((customerId) => customerMap.get(customerId) || null),
    );
  }

  async getCustomer() {
    return await this.customerModel.find();
  }
  async getAllCustomerPagination(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
  ): Promise<Customer[]> {
    const query = search ? { fullname: { $regex: search, $options: 'i' } } : {};
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return this.customerModel
      .find({ ...query })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  }

  async getTotalCustomersCount(search: string): Promise<number> {
    const query = search
      ? { fullname: { $regex: new RegExp(search, 'i') } }
      : {};
    const count = await this.customerModel.countDocuments(query);
    return count;
  }
  async findByUserId(userId: String) {
    const res = await this.customerModel.findOne({ userId: userId });
    return res;
  }

  async findById(customerId: string): Promise<Customer> {
    const result = (await this.customerLoader.load(customerId)) || null;
    return result;
  }
  async createCustomer(createCustomerInput: CreateCustomerInput) {
    return this.customerModel.create(createCustomerInput);
  }
  async updateCustomer(input: UpdateCustomerInput) {
    try {
      const existingDoc = await this.customerModel.findById(input.id);
      if (!existingDoc) {
        return null;
      }
      // Cập nhật dữ liệu từ input vào existingDoc
      Object.assign(existingDoc, input);
      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();
      // console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      // console.error('Error updating document:', error);
      return null;
    }
  }
}
