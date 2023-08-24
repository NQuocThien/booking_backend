import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Certificate {
  @Field()
  name: string

  @Field()
  associationName: string

  @Field({nullable: true})
  state: Boolean

  @Field()
  dateStart: Date

  @Field({nullable: true})
  dateEnd: Date

  @Field()
  description: String
}
