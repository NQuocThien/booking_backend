import { Field, ID, registerEnumType, InputType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender, EStatusService } from 'src/contain';
@InputType()
export class UpdateEvaluateInput {
  @Field()
  id: String;

  @Field()
  comment: String;

  @Field()
  rating: number;
}
