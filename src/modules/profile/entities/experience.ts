import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Experience {
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
