import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
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
