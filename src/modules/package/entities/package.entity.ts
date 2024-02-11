import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { EGender, EStatusService } from 'src/contain';
@ObjectType()
export class Package {
  @Field(() => ID)
  id: String;

  @Field()
  medicalFactilitiesId: String;

  @Field()
  packageName: String;

  @Field(() => EGender)
  gender: EGender;

  @Field()
  price: Number;

  @Field()
  status: EStatusService;

  @Field()
  examinationDetails: String;
}

registerEnumType(EStatusService, {
  name: 'EStatusService',
});
registerEnumType(EGender, {
  name: 'EGender',
});
