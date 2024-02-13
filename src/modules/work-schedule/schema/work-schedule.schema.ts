import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Vaccination {
  @Prop()
  schedule: String;

  @Prop()
  specialistId: String;

  @Prop()
  medicalFactilitiesId: Number;

  @Prop()
  doctorId: String;

  @Prop()
  countryOfOrigin: String;

  @Prop()
  indication: String;

  @Prop()
  status: String;

  @Prop()
  note: String;
}

export const VaccinationSchema = SchemaFactory.createForClass(Vaccination);
