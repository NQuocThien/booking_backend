import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
// import { ObjectId } from 'mongodb';
import { LinkImage } from 'src/modules/users/dto/image';
// import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { MedicalFacilities } from 'src/modules/medical-facilities/entities/mecical-facilies.entity';
import { Doctor } from 'src/modules/doctors/entities/docter.entity';
@ObjectType()
export class User {
  @Field((type) => ID)
  id: String;

  @Field({ nullable: true })
  active: boolean;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => LinkImage, { nullable: true })
  linkImage: LinkImage;

  @Field(() => Customer, { nullable: true })
  customer: Customer;

  @Field(() => MedicalFacilities, { nullable: true })
  medicalFacilities: MedicalFacilities;

  @Field(() => Doctor, { nullable: true })
  doctor: Doctor;
}
