import multer from 'multer';

import { ApiError } from '../utils/ApiError';

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const clinicalTestUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new ApiError(400, 'Solo se permiten imágenes JPG, PNG, WEBP o archivos PDF.'));
      return;
    }

    callback(null, true);
  },
});
