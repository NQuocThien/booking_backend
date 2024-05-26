import { Prop, Schema } from '@nestjs/mongoose';
@Schema({ _id: false })
export class Session {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;
  // ngoại lệ
  // ngày
  // trangthai
  // soluong
}
