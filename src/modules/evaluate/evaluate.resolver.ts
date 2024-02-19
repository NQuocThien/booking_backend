import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Evaluate } from './entities/evaluate.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEvaluateInput } from './entities/dto/create-evaluate.input';
import { UpdateEvaluateInput } from './entities/dto/update-evaluate.input';
import { EvaluateService } from './evaluate.service';

@Resolver(() => Evaluate)
export class EvaluateResolver {
  constructor(private readonly evaluateService: EvaluateService) {}

  @Query(() => [Evaluate], { name: 'getAllEvaluate' })
  async getAllDoctor(): Promise<Evaluate[]> {
    return this.evaluateService.findAll();
  }

  @Query(() => Evaluate, { name: 'getEvaluateById' })
  async getEvaluateById(@Args('id') id: String): Promise<Evaluate> {
    return this.evaluateService.findOneById(id);
  }
  @Mutation(() => Evaluate, { name: 'createEvaluate' })
  async createEvaluate(@Args('input') data: CreateEvaluateInput) {
    return await this.evaluateService.create(data);
  }

  @Mutation(() => Evaluate, { name: 'updateEvaluate' })
  async updateEvaluate(@Args('input') data: UpdateEvaluateInput) {
    return await this.evaluateService.updateById(data);
  }

  @Mutation(() => Evaluate, { name: 'deleteEvaluate' })
  async deleteEvaluate(@Args('id') id: String): Promise<Evaluate> {
    return this.evaluateService.delete(id);
  }
}
