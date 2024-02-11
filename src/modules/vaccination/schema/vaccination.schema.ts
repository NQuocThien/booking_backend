import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
})
export class Vaccination {
  @Prop()
  medicalFactilitiesId: String;

  @Prop()
  vaccineName: String;

  @Prop()
  price: Number;

  @Prop()
  prophylactic: String;

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
