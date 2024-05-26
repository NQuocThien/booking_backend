import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { EStateRegister, ETypeOfService } from 'src/contain';

@InputType()
export class GetRegisterHaveInput {
  @Field(() => ETypeOfService)
  type?: ETypeOfService;

  @Field()
  serviceId: string;

  @Field()
  date: Date;
}
