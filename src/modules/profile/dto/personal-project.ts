import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProsonalProject {
  @Field()
  projectName: string

  @Field()
  state: Boolean

  @Field()
  dateStart: Date

  @Field()
  dateEnd: Date

  @Field({nullable: true})
  description: Date
}
