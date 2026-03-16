import jwt from 'jsonwebtoken';
import { UserService } from './UserService';
import { config } from '../config/env.config';
import { UserRepository } from '../repositories/UserRepository';


// Mock do UserRepository para isolar testes sem depender do banco
import bcrypt from 'bcrypt';

const passwordHash = bcrypt.hashSync('123456', 10);

const mockUser: any = {
  id: 1,
  nome: 'Test User',
  email: 'test@example.com',
  avatar: null,
  bio: null,
  getSenhaHash: () => passwordHash
};

const userRepository: any = {
  findByEmail: async (email: string) => {
    if (email === mockUser.email) return mockUser;
    return null;
  },
  findById: async (id: number) => (id === mockUser.id ? mockUser : null),
  // outros métodos usados em UserService podem ser adicionados se necessário
};

const userService = new UserService(userRepository);

describe('UserService - Login com JWT', () => {
  it('deve retornar token JWT válido após login bem-sucedido', async () => {
    // Arrange
    const credentials = { email: 'test@example.com', senha: '123456' };
    // Assume que usuário já existe no banco

    // Act
    const authResponse = await userService.login(credentials);

    // Assert
    expect(authResponse).toHaveProperty('token');
    expect(authResponse).toHaveProperty('user');
    expect(authResponse.user.email).toBe(credentials.email);
    expect(authResponse.token).toBeTruthy();
    
    // Valida que token é JWT válido
    const decoded = jwt.verify(authResponse.token, config.jwt.secret);
    expect(decoded).toHaveProperty('userId');
  });

  it('token NÃO deve conter senha no payload', async () => {
    const credentials = { email: 'test@example.com', senha: '123456' };
    const authResponse = await userService.login(credentials);
    
    const decoded: any = jwt.decode(authResponse.token);
    expect(decoded).not.toHaveProperty('senha');
    expect(decoded).not.toHaveProperty('password');
  });
});