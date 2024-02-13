import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EStateRegister, ETypeOfService } from 'src/contain';

// Đăng ký enum với GraphQL
registerEnumType(EStateRegister, {
  name: 'EStateRegister',
});
registerEnumType(ETypeOfService, {
  name: 'ETypeOfService',
});
@ObjectType()
export class Register {
  @Field(() => ID)
  id: String;

  @Field()
  customerId: string;

  @Field()
  profileId: string;

  @Field({ nullable: true })
  specialtyId?: String;

  @Field({ nullable: true })
  doctorId?: String;

  @Field({ nullable: true })
  packageId?: String;

  @Field({ nullable: true })
  vaccineId?: String;

  @Field()
  sessionId: String;

  @Field()
  isHealthInsurance: boolean;

  @Field(() => ETypeOfService)
  typeOfService: ETypeOfService;

  @Field()
  date: Date;

  @Field(() => EStateRegister)
  state: EStateRegister;
}
