
import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string): void => {
  try {
    // TODO: verificar se arquivo existe antes de deletar
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Arquivo deletado: ${filePath}`);
    }
  } catch (error) {
    // TODO: Log do erro, mas não propagar (não deve quebrar update)
    console.error('Erro ao deletar arquivo:', error);
  }
};

export const resolveUploadPath = (filename: string): string => {
  // TODO: retornar caminho completo para pasta uploads
  return path.resolve(__dirname, '..', '..', 'uploads', filename);
};