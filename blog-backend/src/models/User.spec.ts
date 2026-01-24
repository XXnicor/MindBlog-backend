// src/models/User.spec.ts
import { User } from './User';

describe('User Model', () => {
  it('deve criar usuário válido', () => {
    const user = User.create('João', 'joao@test.com', '123456');
    
    expect(user.nome).toBe('João');
    expect(user.email).toBe('joao@test.com');
    expect(user.id).toBeNull(); // novo usuário
  });

  it('deve lançar erro para email inválido', () => {
    expect(() => {
      User.create('João', 'email-invalido', '123456');
    }).toThrow('Email inválido');
  });

  it('deve lançar erro para senha curta', () => {
    expect(() => {
      User.create('João', 'joao@test.com', '123');
    }).toThrow('Senha deve ter no mínimo 6 caracteres');
  });

  it('deve reconstruir usuário do banco', () => {
    const user = User.fromDatabase({
      id: 1,
      nome: 'João',
      email: 'joao@test.com',
      senha: 'hash123',
      created_at: new Date()
    });

    expect(user.id).toBe(1);
    expect(user.getSenhaHash()).toBe('hash123');
  });

  it('toDTO não deve expor senha', () => {
    const user = User.fromDatabase({
      id: 1,
      nome: 'João',
      email: 'joao@test.com',
      senha: 'hash123'
    });

    const dto = user.toDTO();
    expect(dto).not.toHaveProperty('senha');
    expect(dto).not.toHaveProperty('senhaHash');
  });
});