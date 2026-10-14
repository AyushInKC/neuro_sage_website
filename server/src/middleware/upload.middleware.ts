import multer from 'multer';

// Use memory storage so we can inspect actual magic numbers in buffer before saving
const storage = multer.memoryStorage();

export const uploadPaymentSlip = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, JPG, and PNG files are supported.'));
    }
  },
});
