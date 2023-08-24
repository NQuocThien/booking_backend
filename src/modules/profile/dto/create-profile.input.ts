import { InputType, Int, Field } from '@nestjs/graphql';
import { ExperienceInput } from './experience';
import { CertificateInput } from './certificate';
import { EducationInput } from './education';
import { PrizeInput } from './Prize';

@InputType()
export class CreateProfileInput {
  @Field({nullable: true})
  introduce: string

  @Field()
  userId: string

  @Field({nullable: true})
  experience: ExperienceInput

  @Field({nullable: true})
  skills: string

  @Field({nullable: true})
  certificate: CertificateInput // chứng chỉ

  @Field({nullable: true})
  education: EducationInput

  @Field({nullable: true})
  prize: PrizeInput
}
