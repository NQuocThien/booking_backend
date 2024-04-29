import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './entities/dtos/create-notification.input';
import { UpdateNotificationInput } from './entities/dtos/update-notification.input';
import { NotificationInput } from './entities/dtos/notification.input';
import { ETypeOfNotification } from 'src/contain';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification], { name: 'getAllNotification' })
  async getAllDoctor(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Mutation(() => Notification, { name: 'createNotification' })
  async createNotification(@Args('input') data: CreateNotificationInput) {
    return await this.notificationService.create(data);
  }

  @Mutation(() => Notification, { name: 'updateNotification' })
  async updateNotification(@Args('input') data: UpdateNotificationInput) {
    return await this.notificationService.updateById(data);
  }

  @Mutation(() => Notification, { name: 'deleteNotification' })
  async deleteNotification(@Args('id') id: String): Promise<Notification> {
    return this.notificationService.delete(id);
  }
}
