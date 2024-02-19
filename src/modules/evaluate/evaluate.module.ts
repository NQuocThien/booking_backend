import { Module } from '@nestjs/common';
import { EvaluateResolver } from './evaluate.resolver';
import { EvaluateService } from './evaluate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluate } from './entities/evaluate.entity';
import { EvaluateSchema } from './schema/evaluate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Evaluate.name,
        schema: EvaluateSchema,
      },
    ]),
  ],
  providers: [EvaluateResolver, EvaluateService],
  exports: [EvaluateService],
})
export class EvaluateModule {}
