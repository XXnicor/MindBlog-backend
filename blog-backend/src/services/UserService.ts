
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserDTO, RegisterData, LoginCredentials, AuthResponse, UpdateProfileData, UserStats, ArticleWithAuthor } from '../types';
import { sign} from 'jsonwebtoken';
import { config } from '../config/env.config';

export class UserService {
  private readonly SALT_ROUNDS = 10;
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async getArticlesByUser(userId: number): Promise<ArticleWithAuthor[]> {
    return this.userRepository.findArticlesByAuthor(userId);
  }

  public async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
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
        senha: hashedPassword,
        avatar: registerData.avatar,
        bio: registerData.bio
      });

      // Busca o usuário criado para retornar o DTO
      const createdUser = await this.userRepository.findById(userId);
      if (!createdUser) {
        throw new Error('Erro ao recuperar usuário criado');
      }

      if (createdUser.id === null) {
        throw new Error('Usuário inválido');
      }

      const token = this.generateToken(Number(createdUser.id));

      return {
        user: this.toDTO(createdUser),
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao registrar usuário');
    }
  }
  private generateToken(userId: number): string {

    const payload = { userId: Number(userId) };


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

      const token = this.generateToken(Number(user.id));

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

  public async updateProfile(id: number, profileData: UpdateProfileData): Promise<UserDTO> {
    try {
      // Verifica se o usuário existe
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Se está mudando a senha, verifica a senha atual
      if (profileData.senha_nova) {
        if (!profileData.senha_atual) {
          throw new Error('Senha atual é obrigatória para alterar a senha');
        }

        const senhaHash = user.getSenhaHash();
        const isPasswordValid = await bcrypt.compare(profileData.senha_atual, senhaHash);
        
        if (!isPasswordValid) {
          throw new Error('Senha atual incorreta');
        }

        // Hash da nova senha
        profileData.senha_nova = await bcrypt.hash(profileData.senha_nova, this.SALT_ROUNDS);
      }

      // Se está atualizando o email, verifica se já não existe
      if (profileData.email && profileData.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(profileData.email);
        if (existingUser) {
          throw new Error('Email já está em uso');
        }
      }

      // Remove avatar do profileData se for undefined (não sobrescrever)
      if (profileData.avatar === undefined) {
        delete profileData.avatar;
      }

      // Atualiza o perfil
      const updated = await this.userRepository.updateProfile(id, profileData);
      if (!updated) {
        throw new Error('Erro ao atualizar perfil');
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
      throw new Error('Erro ao atualizar perfil');
    }
  }

  public async getUserStats(userId: number): Promise<UserStats> {
    try {
      return await this.userRepository.getUserStats(userId);
    } catch (error) {
      throw new Error('Erro ao buscar estatísticas do usuário');
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
      email: user.email,
      avatar: user.avatar,
      bio: user.bio
    };
  }

}