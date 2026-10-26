import multer from 'multer';

// Use memoryStorage so uploaded files are buffered in memory and piped directly to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn tối đa 10MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận các định dạng ảnh phổ biến
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file định dạng hình ảnh (JPG, PNG, WEBP, JPEG)!'));
    }
  },
});
