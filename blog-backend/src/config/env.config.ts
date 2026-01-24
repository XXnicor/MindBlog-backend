import dotenv from 'dotenv';
import path from 'path';

// Carrega .env para process.env
dotenv.config();

interface EnvConfig {
  server: {
    port: number;
    nodeEnv: string;
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  upload: {
    path: string;
    maxFileSize: number;
  };
}

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variável de ambiente obrigatória ausente: ${key}`);
  }
  return value;
}

function getEnvAsNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue !== undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value || '', 10);
  if (isNaN(parsed)) {
    throw new Error(`❌ Variável ${key} deve ser um número válido`);
  }
  return parsed;
}

export const config: EnvConfig = {
  server: {
    port: getEnvAsNumber('PORT', 3000),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: getEnvOrThrow('DB_HOST'),
    port: getEnvAsNumber('DB_PORT'),
    user: getEnvOrThrow('DB_USER'),
    password: getEnvOrThrow('DB_PASSWORD'),
    name: getEnvOrThrow('DB_NAME'),
  },
  jwt: {
    secret: getEnvOrThrow('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: getEnvAsNumber('MAX_FILE_SIZE', 5242880), // 5MB default
  },


};
