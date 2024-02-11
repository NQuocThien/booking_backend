import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './entities/dto/create-customer.input';
import { UpdateCustomerInput } from './entities/dto/update-customer.input';

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
    const res = await this.customerModel.findOne({ userId: userId });
    console.log('test user id===', userId);
    console.log('test ===', res);
    return res;
  }
  async createCustomer(createCustomerInput: CreateCustomerInput) {
    return this.customerModel.create(createCustomerInput);
  }
  async updateCustomer(input: UpdateCustomerInput) {
    try {
      const existingDoc = await this.customerModel.findById(input.id);
      if (!existingDoc) {
        console.log('Document not found for ID:', input.id);
        return null;
      }
      // Cập nhật dữ liệu từ input vào existingDoc
      Object.assign(existingDoc, input);
      // Lưu tài liệu đã cập nhật
      const updatedDoc = await existingDoc.save();
      console.log('---> Updated document:', updatedDoc);
      return updatedDoc;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }
}
