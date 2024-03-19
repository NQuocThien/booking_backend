import { Field, InputType } from '@nestjs/graphql';
import { EStatusService, ETypeOfFacility } from 'src/contain';
import { LinkImageInput } from 'src/modules/users/dto/linkimage.input';

@InputType()
export class UpdateMedicalFacilityInput {
  @Field()
  id: String;

  @Field()
  userId: string;

  @Field()
  medicalFacilityName: string;

  @Field()
  address: string;

  @Field()
  numberPhone?: string;

  @Field()
  logo?: LinkImageInput;

  @Field()
  image?: LinkImageInput;

  @Field()
  email?: string;

  @Field({ nullable: true })
  lat: number;

  @Field({ nullable: true })
  lng: number;

  @Field()
  discription: string;

  @Field()
  introduce: string;

  @Field(() => ETypeOfFacility)
  typeOfFacility: ETypeOfFacility;

  @Field()
  operatingStatus: string; // trạng thái hoạt động

  @Field()
  legalRepresentation: string; // đại diện pháp luật

  @Field()
  taxCode: string; // mã số thuế

  @Field(() => String)
  status: EStatusService;

  @Field(() => [Date], { nullable: true })
  dateOff: [Date];

  @Field()
  schedule: string;
}
