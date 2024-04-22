import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAllRegisInYearInput {
  @Field(() => [String])
  doctorIds: string[];

  @Field(() => [String])
  packageIds: string[];

  @Field(() => [String])
  vaccineIds: string[];

  @Field(() => [String])
  specialtyIds: string[];

  @Field(() => [String])
  year: number;
}
