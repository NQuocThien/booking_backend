import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class ExperienceInput {
  @Field()
  position: string

  @Field()
  companyName: string

  @Field({nullable: true})
  state: Boolean
  
  @Field()
  dateStart: Date

  @Field({nullable: true})
  dateEnd: Date

  @Field({nullable: true})
  description: String
}
