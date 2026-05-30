import { upload } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'File too large. Max size is 5MB'));
      }
      return next(new ApiError(400, err.message));
    }
    next();
  });
};