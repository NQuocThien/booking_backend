import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class EducationInput {
  @Field()
  major: string

  @Field()
  schoolName: string

  @Field()
  state: Boolean

  @Field()
  dateStart: Date

  @Field({nullable: true})
  dateEnd: Date

  @Field({nullable: true})
  description: String
}
