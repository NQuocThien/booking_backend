import { Field, InputType } from '@nestjs/graphql';
import { ETypeOfService } from 'src/contain';
@InputType()
export class CreateEvaluateInput {
  @Field()
  userId: string;

  @Field()
  registerId: string;

  @Field()
  customerName: string;

  @Field(() => ETypeOfService)
  typeOfService: ETypeOfService;

  @Field({ nullable: true })
  specialtyId: string;

  @Field({ nullable: true })
  doctorId: string;

  @Field({ nullable: true })
  packageId?: string;

  @Field({ nullable: true })
  vaccineId?: string;

  @Field()
  comment: string;

  @Field()
  rating: number;
}
