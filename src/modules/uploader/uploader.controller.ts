import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
  } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v1 } from 'uuid'
const editFileName = (_, file, callback) => {
    callback(null, v1() + '--' + file.originalname)
  }
export const imageFilter = (_, file, callback) => {
if (
    !file.originalname.match(
    /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|svg|SVG|bmp|BMP)$/,
    )
) {
    return callback(new Error('Only image are allowed!'), false)
}
callback(null, true)
}

@Controller()
export class UploaderController {
    // images
  @Post('webinfoImageUpload')
  // @Authenticated()
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: `${process.env.FILE_PATH || 'files'}/images`,
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    const response = []
    files.forEach((file) => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      }
      response.push(fileResponse)
    })
    return response
  }
}
