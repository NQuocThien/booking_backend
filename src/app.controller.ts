import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/images/:folder?/:filename')
  async serveImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      let imagePath = path.join(process.cwd(), '/files/images/');
      // Nếu có tham số folder, thêm vào đường dẫn
      if (folder) {
        imagePath = path.join(imagePath, folder);
      }
      imagePath = path.join(imagePath, filename);
      // console.log('--> get image: ' + filename);
      // Kiểm tra xem tệp có tồn tại không
      if (!fs.existsSync(imagePath)) {
        // Trả về lỗi 404 Not Found nếu tệp không tồn tại
        return res.status(404).send('Image not found');
      }
      // Nếu tệp tồn tại, trả về nó bằng phản hồi HTTP
      return res.sendFile(imagePath);
    } catch (e) {
      console.error(e);
    }
  }
}
