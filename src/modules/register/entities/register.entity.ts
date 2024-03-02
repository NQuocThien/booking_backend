import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EStateRegister, ETypeOfService } from 'src/contain';
import { Session } from 'src/modules/contains/session/session.entitty';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Profile } from 'src/modules/profile/entity/profile.entity';

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
  profileId: string;

  @Field({ nullable: true })
  specialtyId?: String;

  @Field({ nullable: true })
  doctorId?: String;

  @Field({ nullable: true })
  packageId?: String;

  @Field({ nullable: true })
  vaccineId?: String;

  @Field(() => Session)
  session: Session;

  @Field()
  isHealthInsurance: boolean;

  @Field(() => String)
  typeOfService: ETypeOfService;

  @Field()
  date: Date;

  @Field(() => String)
  state: EStateRegister;

  @Field(() => Profile)
  profile: Profile;
}
