
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      cb(err as any, uploadDir);
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => { 
    const ext = path.extname(file.originalname).toLowerCase();
    const random = crypto.randomBytes(16).toString('hex');
    const filename = `${Date.now()}-${random}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  const err: any = new Error('Apenas imagens JPG, PNG, GIF e WEBP são permitidas');
  err.code = 'INVALID_FILE_TYPE';
  cb(err);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB em bytes (5 * 1024 * 1024)
  }
});