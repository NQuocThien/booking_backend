import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ETypeOfService } from 'src/contain';
@ObjectType()
export class Evaluate {
  @Field(() => ID)
  id: String;

  @Field()
  userId: string;

  @Field()
  customerName: string;

  @Field()
  registerId?: string;

  @Field(() => String)
  typeOfService: ETypeOfService;

  @Field({ nullable: true })
  specialtyId?: string;

  @Field({ nullable: true })
  doctorId?: string;

  @Field({ nullable: true })
  packageId?: string;

  @Field({ nullable: true })
  vaccineId?: string;

  @Field()
  comment: string;

  @Field()
  rating: number;

  @Field()
  createdAt: number;

  @Field({ nullable: true })
  updatedAt: number;
}
