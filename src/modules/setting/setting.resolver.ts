import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SettingService } from './setting.service';
import { Setting } from './entities/setting.entity';
import { CreateSettingInput } from './dto/create-setting.input';
import { UpdateSettingInput } from './dto/update-setting.input';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Mutation(() => Setting)
  updateSetting(@Args('updateSettingInput') updateSettingInput: UpdateSettingInput) {
    return this.settingService.update(updateSettingInput.id, updateSettingInput);
  }
 
  @Query(()=> Setting)
  async getSetting(): Promise<Setting>{
    return await this.settingService.findOne();
  }
}
