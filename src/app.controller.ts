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
      if (folder) {
        imagePath = path.join(imagePath, folder);
      }
      imagePath = path.join(imagePath, filename);
      if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
      }
      return res.sendFile(imagePath);
    } catch (e) {
      console.error(e);
    }
  }

  @Get('/documents/:filename')
  async serverDocument(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      let imagePath = path.join(process.cwd(), '/files/documents/');
      imagePath = path.join(imagePath, filename);
      if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
      }
      return res.sendFile(imagePath);
    } catch (e) {
      console.error(e);
    }
  }

  @Get('/download/doctor/:filename')
  async getExcel(@Res() res: Response, @Param('filename') filename: string) {
    try {
      const filePath = path.join(process.cwd(), 'files', 'exports', filename);
      const fileStream = fs.createReadStream(filePath);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      fileStream.pipe(res);
      fileStream.on('end', () => {
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error('Error occurred while sending Excel file:', error);
      res.status(500).send('Error occurred while sending Excel file');
    }
  }
}
