
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserDTO, RegisterData, LoginCredentials, AuthResponse} from '../types';
import { sign} from 'jsonwebtoken';
import { config } from '../config/env.config';

export class UserService {
  private readonly SALT_ROUNDS = 10;
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async register(registerData: RegisterData): Promise<UserDTO> {
    try {
      // Verifica se o email já está em uso
      const existingUser = await this.userRepository.findByEmail(registerData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(registerData.senha, this.SALT_ROUNDS);

      // Cria o usuário com senha hasheada
      const userId = await this.userRepository.create({
        nome: registerData.nome,
        email: registerData.email,
        senha: hashedPassword
      });

      // Busca o usuário criado para retornar o DTO
      const createdUser = await this.userRepository.findById(userId);
      if (!createdUser) {
        throw new Error('Erro ao recuperar usuário criado');
      }

      return this.toDTO(createdUser);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao registrar usuário');
    }
  }
  private generateToken(userId: number): string {

    const payload = { userId };


    const token = sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as number } 
    );

    return token;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Busca o usuário pelo email
      const user = await this.userRepository.findByEmail(credentials.email);
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verifica a senha
      const senhaHash = user.getSenhaHash();
      const isPasswordValid = await bcrypt.compare(credentials.senha, senhaHash);
      
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      if (user.id === null) {
        throw new Error('Usuário inválido');
      }

      const token = this.generateToken(user.id);

      return {
        user:this.toDTO(user),
        token: token
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao fazer login');
    }
  }

  public async getUserById(id: number): Promise<UserDTO | null> {

    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }
      return this.toDTO(user);

    } catch (error) {
      throw new Error('Erro ao buscar usuário');
    }
  }

  /**
   * Lista todos os usuários
   * @returns Array de DTOs de usuários
   */
  public async getAllUsers(): Promise<UserDTO[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map(user => this.toDTO(user));
    } catch (error) {
      throw new Error('Erro ao listar usuários');
    }
  }

  public async updateUser(id: number, updateData: Partial<RegisterData>): Promise<UserDTO> {
    try {
      // Verifica se o usuário existe
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Se está atualizando o email, verifica se já não existe
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(updateData.email);
        if (existingUser) {
          throw new Error('Email já está em uso');
        }
      }

      // Se está atualizando a senha, faz o hash
      if (updateData.senha) {
        updateData.senha = await bcrypt.hash(updateData.senha, this.SALT_ROUNDS);
      }

      // Atualiza o usuário
      const updated = await this.userRepository.update(id, updateData);
      if (!updated) {
        throw new Error('Erro ao atualizar usuário');
      }

      // Retorna o usuário atualizado
      const updatedUser = await this.userRepository.findById(id);
      if (!updatedUser) {
        throw new Error('Erro ao recuperar usuário atualizado');
      }

      return this.toDTO(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar usuário');
    }
  }

  /**
   * Deleta um usuário
   * @param id ID do usuário
   * @returns true se deletou com sucesso
   */
  public async deleteUser(id: number): Promise<boolean> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        throw new Error('Usuário não encontrado');
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar usuário');
    }
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email
    };
  }

}