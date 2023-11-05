import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ImageNotFoundMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        // Xử lý logic kiểm tra hình ảnh và trả về hoặc bỏ qua middleware.
        // ...
        next(); // Đảm bảo gọi next() để bỏ qua middleware khi không tìm thấy hình ảnh.
    }
}