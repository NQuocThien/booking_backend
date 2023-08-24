import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CertificateInput {
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
