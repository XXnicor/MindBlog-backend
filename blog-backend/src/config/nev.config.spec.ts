import { config } from './env.config';

describe('EnvConfig', () => {
  it('deve carregar todas as variáveis obrigatórias', () => {
    expect(config.jwt.secret).toBeDefined();
    expect(typeof config.database.host).toBe('string');
    expect(typeof config.database.port).toBe('number');
    expect(typeof config.server.port).toBe('number');
  });

  it('deve converter PORT para número', () => {
    expect(typeof config.server.port).toBe('number');
  });

  it('deve usar valor padrão para UPLOAD_PATH se ausente', () => {
    expect(config.upload.path).toBe('./uploads');
  });
});