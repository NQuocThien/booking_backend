import {
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { DegreeService } from './degree.service';
import { Degree } from './entities/degree.entity';
import { Query } from '@nestjs/graphql';
import { CreateDegreeInput } from './entities/dtos/create-degree.input';
import { resolve } from 'path';
import { UpdateDegreeInput } from './entities/dtos/update-degree.input';
import { Doctor } from '../doctors/entities/doctor.entity';
import { DoctorsService } from '../doctors/doctors.service';

@Resolver(() => Degree)
export class DegreeResolver {
  constructor(
    private readonly degreeService: DegreeService,
    private readonly doctorService: DoctorsService,
  ) {}

  @Query(() => [Degree], { name: 'getAllDegree' })
  async getAllDegree(): Promise<Degree[]> {
    console.log('test ----------------');
    // return;
    return this.degreeService.getAllDegree();
  }

  @Mutation(() => Degree, { name: 'createDegree' })
  async createDegree(@Args('input') input: CreateDegreeInput): Promise<Degree> {
    console.log('----> Create Degree -- Input: ', input);
    const res = await this.degreeService.createDegree(input);
    return res;
  }
  @Mutation(() => Degree, { name: 'updateDegree' })
  async updateDegree(@Args('input') input: UpdateDegreeInput): Promise<Degree> {
    console.log('----> Update Degree -- Input: ', input);
    const res = await this.degreeService.updateDegree(input);
    return res;
  }
  @Mutation(() => Degree, { name: 'deleteDegree' })
  async delete(@Args('input') id: String): Promise<Degree> {
    console.log('----> Delete Degree -- Input: ', id);
    const res = await this.degreeService.delete(id);
    return res;
  }

  @ResolveField(() => Doctor, { name: 'doctor' })
  async doctor(@Parent() degree: Degree): Promise<Doctor> {
    return this.doctorService.findOneByDegreeId(degree.id);
  }
}
