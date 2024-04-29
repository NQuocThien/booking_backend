import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    email: string,
    customerName: string,
    profileName: string,
    typeService: string,
    service: string,
    date: string,
    startTime: string,
    endTime: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Thông báo trạng thái đăng ký BookingCare',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        customerName: customerName,
        profileName: profileName,
        typeService: typeService,
        service: service,
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
    });
  }
  async sendUserSuccesss(
    email: string,
    customerName: string,
    profileName: string,
    typeService: string,
    service: string,
    date: string,
    startTime: string,
    endTime: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Thông báo trạng thái đăng ký BookingCare',
      template: './success', // `.hbs` extension is appended automatically
      context: {
        customerName: customerName,
        profileName: profileName,
        typeService: typeService,
        service: service,
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
    });
  }
}
