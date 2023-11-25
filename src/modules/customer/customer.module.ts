import { Module } from '@nestjs/common';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),
  ],
  providers: [CustomerResolver, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
