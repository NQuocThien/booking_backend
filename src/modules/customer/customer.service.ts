import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './entities/dto/create-customer.input';
import { UpdateCustomerInput } from './entities/dto/update-customer.input';
import * as DataLoader from 'dataloader';
import { CustomerInput } from './entities/dto/customer.input';
import { generateShortCode } from 'src/utils/contain';
import { CreateBlockInput } from '../contains/blocks/blocks.input';
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

  async findByIdsAndKeys(
    customerIds: string[],
    keys: string[],
    page: number,
    limit: number,
    search: string,
    sortField: string = 'fullname',
    sortOrder: string = 'asc',
  ): Promise<Customer[]> {
    const sortOptions: { [key: string]: 'asc' | 'desc' } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;

    const query: any = {
      $or: [{ _id: { $in: customerIds } }, { customerKey: { $in: keys } }],
    };

    if (search) {
      query.$text = { $search: search };
    }

    const result = await this.customerModel
      .find({
        ...query,
      })
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .exec();
    return result;
  }

  async findByIdsAndKeysCount(
    customerIds: string[],
    keys: string[],
    search: string,
  ): Promise<number> {
    const query: any = {
      $or: [{ _id: { $in: customerIds } }, { customerKey: { $in: keys } }],
    };

    if (search) {
      query.$text = { $search: search };
    }

    const result = await this.customerModel.count({
      ...query,
    });
    return result;
  }

  async findCustomerById(customerId: string): Promise<Customer> {
    const result = await this.customerModel.findById(customerId);
    return result;
  }
  async findByCustomerKey(customerKey: string): Promise<Customer> {
    const result = this.customerModel.findOne({ customerKey: customerKey });
    return result;
  }
  async createCustomer(createCustomerInput: CreateCustomerInput) {
    const inputCustomer: CustomerInput = {
      ...createCustomerInput,
      customerKey: `kh--${generateShortCode()}`,
    };
    return this.customerModel.create(inputCustomer);
  }
  async updateCustomer(input: UpdateCustomerInput) {
    try {
      const existingDoc = await this.customerModel.findById(input.id);
      if (!existingDoc) {
        return null;
      }
      Object.assign(existingDoc, input);
      const updatedDoc = await existingDoc.save();
      return updatedDoc;
    } catch (error) {
      // console.error('Error updating document:', error);
      return null;
    }
  }
  // async addBlockCustomer(customerId: string, input: CreateBlockInput) {
  //   try {
  //     const existingDoc = await this.customerModel.findById(customerId);
  //     if (!existingDoc) {
  //       return null;
  //     }
  //     const newDoc = existingDoc;
  //     if (newDoc.blocks) {
  //       newDoc.blocks = [...newDoc.blocks, input];
  //     } else {
  //       newDoc.blocks = [input];
  //     }
  //     Object.assign(existingDoc, newDoc);
  //     const updatedDoc = await existingDoc.save();
  //     return updatedDoc;
  //   } catch (error) {
  //     // console.error('Error updating document:', error);
  //     return null;
  //   }
  // }
}
