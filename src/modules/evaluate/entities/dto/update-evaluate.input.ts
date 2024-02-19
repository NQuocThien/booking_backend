import { Field, ID, registerEnumType, InputType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender, EStatusService } from 'src/contain';
@InputType()
export class UpdateEvaluateInput {
  @Field()
  id: String;

  @Field()
  userId: string;

  @Field()
  registerId?: string;

  @Field()
  comment: String;

  @Field()
  rating: number;
}

registerEnumType(EDegree, {
  name: 'EDegree',
});
registerEnumType(EAcademicTitle, {
  name: 'EAcademicTitle',
});
registerEnumType(EGender, {
  name: 'EGender',
});
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
