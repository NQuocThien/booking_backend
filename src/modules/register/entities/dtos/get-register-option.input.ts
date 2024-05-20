import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';

@InputType()
export class GetRegisterByOptionInput {
  @Field({ nullable: true })
  doctorId?: string;

  @Field({ nullable: true })
  packageId?: string;

  @Field({ nullable: true })
  vaccineId?: string;

  @Field({ nullable: true })
  specialtyId?: string;

  @Field({ nullable: true })
  pedding: boolean;

  @Field()
  date: Date;
}
