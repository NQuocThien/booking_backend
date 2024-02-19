import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { EAcademicTitle, EDegree, EGender, EStatusService } from 'src/contain';
import { WorkSchedule } from 'src/modules/contains/work-schedule/work-schedule.entity';
import { LinkImage } from 'src/modules/users/dto/image';
@ObjectType()
export class Evaluate {
  @Field(() => ID)
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
