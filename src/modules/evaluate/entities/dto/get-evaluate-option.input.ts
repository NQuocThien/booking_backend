import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class GetEvaluateOptionInput {
  @Field({ nullable: true })
  specialtyId: string;

  @Field({ nullable: true })
  doctorId: string;

  @Field({ nullable: true })
  packageId?: string;

  @Field({ nullable: true })
  vaccineId?: string;
}
