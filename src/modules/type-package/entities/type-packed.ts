import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CarePackage } from 'src/modules/care-package/entities/care-package.entity';

@ObjectType()
export class TypePackage {
  @Field(() => ID)
  id: String;

  @Field()
  typeName: String;

  @Field(() => [CarePackage], { nullable: true })
  carePackage: CarePackage[];
}
