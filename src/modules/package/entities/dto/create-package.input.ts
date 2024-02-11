import {
  ObjectType,
  Field,
  registerEnumType,
  ID,
  InputType,
} from '@nestjs/graphql';
import { EGender, EStatusService } from 'src/contain';
@InputType()
export class CreatePackageInput {
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
