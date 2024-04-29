import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { EStateRegister } from 'src/contain';

@InputType()
export class GetRegisterByOptionInput {
  @Field({ nullable: true })
  doctorId?: String;

  @Field({ nullable: true })
  packageId?: String;

  @Field({ nullable: true })
  vaccineId?: String;

  @Field({ nullable: true })
  specialtyId?: String;

  @Field({ nullable: true })
  pedding: boolean;

  @Field()
  date: Date;
}
