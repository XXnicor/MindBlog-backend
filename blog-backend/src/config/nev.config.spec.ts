import { config } from './env.config';

describe('EnvConfig', () => {
  it('deve carregar todas as variáveis obrigatórias', () => {
    expect(config.jwt.secret).toBeDefined();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(3306);
    expect(config.server.port).toBe(3000);
  });

  it('deve converter PORT para número', () => {
    expect(typeof config.server.port).toBe('number');
  });

  it('deve usar valor padrão para UPLOAD_PATH se ausente', () => {
    expect(config.upload.path).toBe('./uploads');
  });
});