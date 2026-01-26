import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
  }
};

export const resolveUploadPath = (filename: string): string => {
  return path.resolve(__dirname, '..', '..', 'uploads', filename);
};