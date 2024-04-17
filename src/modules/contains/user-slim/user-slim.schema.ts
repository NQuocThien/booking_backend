import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class UserSlim {
  @Prop(() => String)
  username: string;

  @Prop(() => String)
  showName: string;

  @Prop(() => String)
  role: string;
}
