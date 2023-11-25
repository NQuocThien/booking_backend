import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Backend Web Booking <br> <h3>Nguyễn Quốc Thiện</h3>  <h4> DH21TH2 -- DTH205987</h4>';
  }
}
