import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { EStateRegister, ETypeOfService } from 'src/contain';

registerEnumType(EStateRegister, {
  name: 'EStateRegister',
});
registerEnumType(ETypeOfService, {
  name: 'ETypeOfService',
});
@InputType()
export class CreateRegisterInput {
  @Field({ nullable: true })
  createdBy: string;

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

  @Field(() => ETypeOfService)
  typeOfService: ETypeOfService;

  @Field()
  date: Date;

  @Field()
  cancel: boolean;

  @Field(() => EStateRegister)
  state: EStateRegister;
}
