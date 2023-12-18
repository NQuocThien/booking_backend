import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CarePackage } from 'src/modules/care-package/entities/care-package.entity';
import { Profile } from 'src/modules/profile/entity/profile.entity';
export enum RegisterState {
  Active = 'active',
  NoActive = 'noactive',
  Success = 'success',
}

// Đăng ký enum với GraphQL
registerEnumType(RegisterState, {
  name: 'RegisterState',
  description: 'Trạng thái của Register',
});
@ObjectType()
export class Register {
  @Field(() => ID)
  id: String;

  @Field()
  profileId: string;

  @Field()
  packegeId: string;

  @Field()
  date: Date;

  @Field(() => RegisterState)
  state: RegisterState;

  @Field(() => CarePackage, { nullable: true })
  carePackage: CarePackage;

  @Field(() => Profile, { nullable: true })
  profile: Profile;
}
