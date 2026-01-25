import jwt from 'jsonwebtoken';
import { UserService } from './UserService';
import { config } from '../config/env.config';
import { UserRepository } from '../repositories/UserRepository';


// Mock do UserRepository
const userRepository = new UserRepository();
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