import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v1 } from 'uuid';
import { promises as fsPromises } from 'fs';
const editFileName = (_, file, callback) => {
  callback(null, v1() + '--' + file.originalname);
};
export const imageFilter = (_, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|svg|SVG|bmp|BMP)$/,
    )
  ) {
    return callback(new Error('Only image are allowed!'), false);
  }
  callback(null, true);
};
export const documentFilter = (_, file, callback) => {
  if (
    !file.originalname.match(/\.(doc|DOC|docx|DOCX|pdf|PDF|ppt|PPT|pptx|PPTX)$/)
  ) {
    return callback(new Error('Only powerpoint are allowed!'), false);
  }
  callback(null, true);
};
export const getDestination = (req, file, callback) => {
  // Bạn cần truyền loại hình ảnh từ phía client, ví dụ: req.body.imageType
  const imageType = req.headers.imagetype || '';

  let destination = `${process.env.FILE_PATH || 'files'}/images`;

  switch (imageType) {
    case 'doctors':
      destination = `${destination}/doctors`;
      break;
    case 'packages':
      destination = `${destination}/packages`;
      break;
    case 'facilities':
      destination = `${destination}/facilities`;
      break;
    case 'users':
      destination = `${destination}/users`;
      break;
    case 'blogs':
      destination = `${destination}/blogs`;
      break;
    default:
      destination = `${destination}`;
  }
  callback(null, destination);
};
@Controller()
export class UploaderController {
  // images
  @Post('webbookingImageUpload')
  // @Authenticated()
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: getDestination,
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    try {
      const response = [];
      files.forEach((file) => {
        const fileResponse = {
          originalname: file.originalname,
          filename: file.filename,
        };
        console.log('--> Uploaded image: ', fileResponse.filename);
        response.push(fileResponse);
      });
      return response;
    } catch (e) {
      console.error(e);
      throw new Error('Can not Upload ');
    }
  }
  // ================================================================================================
  @Post('webbookingDocumentUpload')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: `${process.env.FILE_PATH || 'files'}/documents`,
        filename: editFileName,
      }),
      fileFilter: documentFilter,
    }),
  )
  async uploadDocuments(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    try {
      const response = [];
      files.forEach((file) => {
        const fileResponse = {
          originalname: file.originalname,
          filename: file.filename,
        };
        response.push(fileResponse);
      });
      return response;
    } catch (e) {
      console.error(e);
      throw new Error('Can not Upload document ');
    }
  }

  @Delete('webbookingImageDelete/:filename')
  async deleteImage(@Param('filename') filename: string) {
    try {
      const imageDirectory = `${
        process.env.FILE_PATH || 'files'
      }/images/doctors`;
      const imagePath = `${imageDirectory}/${filename}`;
      const fileStats = await fsPromises.stat(imagePath);
      if (fileStats.isFile()) {
        await fsPromises.unlink(imagePath);
        console.log('\t---> image detected: ', imagePath);
      } else {
        throw new NotFoundException('Image not found', filename);
      }
    } catch (e) {
      return { error: 'Không thể xóa hình ảnh' };
    }
  }
}
