import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as  path from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/images/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {

      console.log('image name: ', filename);
      const imagePath = path.join(process.cwd(), '/files/images/', filename);
      console.log('image path: ' + imagePath);
      // // Kiểm tra xem tệp có tồn tại không
      if (!fs.existsSync(imagePath)) {
        // Trả về lỗi 404 Not Found nếu tệp không tồn tại
        return res.status(404).send('Image not found');
      }
      // Nếu tệp tồn tại, trả về nó bằng phản hồi HTTP
      return res.sendFile(imagePath);
    } catch (e) {
      console.error(e)
    }
  }
}
