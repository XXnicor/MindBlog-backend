
import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => { 
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Apenas imagens JPG e PNG são permitidas'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB em bytes (5 * 1024 * 1024)
  }
});