import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Evaluate } from './entities/evaluate.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEvaluateInput } from './entities/dto/create-evaluate.input';
import { UpdateEvaluateInput } from './entities/dto/update-evaluate.input';
import { EvaluateService } from './evaluate.service';
import { GetEvaluateOptionInput } from './entities/dto/get-evaluate-option.input';

@Resolver(() => Evaluate)
export class EvaluateResolver {
  constructor(private readonly evaluateService: EvaluateService) {}

  @Query(() => [Evaluate], { name: 'getAllEvaluate' })
  async getAllDoctor(): Promise<Evaluate[]> {
    return this.evaluateService.findAll();
  }

  @Query(() => [Evaluate], { name: 'getEvaluateByOption' })
  async getEvaluateByOption(
    @Args('option') option: GetEvaluateOptionInput,
  ): Promise<Evaluate[]> {
    return this.evaluateService.findByOption(option);
  }

  @Query(() => Evaluate, { name: 'getEvaluateById' })
  async getEvaluateById(@Args('id') id: String): Promise<Evaluate> {
    return this.evaluateService.findOneById(id);
  }

  @Query(() => Evaluate, { name: 'getEvaluateByRegisId' })
  async getEvaluateByRegisId(@Args('regisId') id: String): Promise<Evaluate> {
    return this.evaluateService.findOneByRegisId(id);
  }

  // ====================== MUTATION ==============================================
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
