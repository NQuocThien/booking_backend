import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Education {
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
