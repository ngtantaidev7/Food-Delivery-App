import { Router, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { upload } from '../middlewares/upload';

const router = Router();

// Hàm helper upload buffer lên Cloudinary
const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = 'food-delivery'
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' }, // Tự động tối ưu dung lượng ảnh
          { fetch_format: 'auto' }, // Tự động chuyển sang WebP nếu trình duyệt/thiết bị hỗ trợ
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload lên Cloudinary thất bại'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

// Route: Upload 1 ảnh (ví dụ: ảnh dao nĩa trong Chat, ảnh đại diện, ảnh món ăn)
router.post('/single', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn 1 file hình ảnh!' });
    }

    const folder = (req.body.folder as string) || 'food-delivery/general';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    return res.status(200).json({
      success: true,
      message: 'Upload ảnh thành công!',
      data: result,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xử lý upload ảnh',
    });
  }
});

// Route: Upload nhiều ảnh cùng lúc (tối đa 5 ảnh)
router.post('/multiple', upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất 1 hình ảnh!' });
    }

    const folder = (req.body.folder as string) || 'food-delivery/general';
    const uploadPromises = files.map((file) => uploadBufferToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: `Upload thành công ${results.length} ảnh!`,
      data: results,
    });
  } catch (error: any) {
    console.error('Upload Multiple Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xử lý upload ảnh',
    });
  }
});

export default router;
