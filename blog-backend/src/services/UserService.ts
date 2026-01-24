// src/services/UserService.ts
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserDTO, RegisterData, LoginCredentials } from '../types';

export class UserService {
  private readonly SALT_ROUNDS = 10;
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Registra um novo usuário
   * @param registerData Dados de cadastro (nome, email, senha)
   * @returns DTO do usuário criado (sem senha)
   */
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

  /**
   * Autentica um usuário
   * @param credentials Email e senha
   * @returns DTO do usuário autenticado
   */
  public async login(credentials: LoginCredentials): Promise<UserDTO> {
    try {
      // Busca o usuário pelo email
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verifica a senha
      const isPasswordValid = await bcrypt.compare(credentials.senha, user.senha);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      return this.toDTO(user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao fazer login');
    }
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   * @returns DTO do usuário ou null
   */
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

  /**
   * Atualiza dados de um usuário
   * @param id ID do usuário
   * @param updateData Dados para atualização
   * @returns DTO do usuário atualizado
   */
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

  /**
   * Converte User para UserDTO (remove senha)
   * @param user Entidade User completa
   * @returns UserDTO sem senha
   */
  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email
    };
  }
}