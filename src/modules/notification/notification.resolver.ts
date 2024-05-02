import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './entities/dtos/create-notification.input';
import { UpdateNotificationInput } from './entities/dtos/update-notification.input';
import { PubSub } from 'graphql-subscriptions';
const pubSub = new PubSub();

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification], { name: 'getAllNotificationByUserId' })
  async getAllNotificationByUserId(
    @Args('userId') userId: string,
  ): Promise<Notification[]> {
    return this.notificationService.findByUserId(userId);
  }

  @Query(() => [Notification], { name: 'getAllNotification' })
  async getAllNotification(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }
  // ==================================== MUTATION =================================
  @Mutation(() => Notification, { name: 'createNotification' })
  async createNotification(@Args('input') data: CreateNotificationInput) {
    const res = await this.notificationService.create(data);
    this.emitNotifyCreatedEvent(res);
    return res;
  }

  @Mutation(() => Notification, { name: 'updateNotification' })
  async updateNotification(@Args('input') data: UpdateNotificationInput) {
    return await this.notificationService.updateById(data);
  }

  @Mutation(() => String, { name: 'seenAllNotification' })
  async seenAllNotification(@Args('userId') userId: string) {
    try {
      await this.notificationService.seenAll(userId);
      return 'Updated successfully';
    } catch (err) {
      throw new Error('Have error');
    }
  }

  @Mutation(() => String, { name: 'seenNotificationById' })
  async seenNotificationById(@Args('id') id: string) {
    try {
      await this.notificationService.seenById(id);
      return 'Updated successfully';
    } catch (err) {
      throw new Error('Have error');
    }
  }

  @Mutation(() => Notification, { name: 'deleteNotification' })
  async deleteNotification(@Args('id') id: String): Promise<Notification> {
    return this.notificationService.delete(id);
  }
  // ==================================== SUBSCRIPTION =================================

  @Subscription(() => Notification, {
    name: 'notifyCreated',
    filter: (payload, variables) => {
      const userId = variables.userId;
      // --- payload ---
      const notify = payload.notifyCreated;
      return notify.userId === userId;
    },
  })
  async notifyCreated(@Args('userId') userId: string) {
    return pubSub.asyncIterator('notifyCreated');
  }

  public async emitNotifyCreatedEvent(notify: Notification): Promise<void> {
    await pubSub.publish('notifyCreated', {
      notifyCreated: notify,
    });
  }
}
