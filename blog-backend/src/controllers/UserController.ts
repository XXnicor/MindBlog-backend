// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { RegisterData, LoginCredentials, AuthRequest, UpdateProfileData } from '../types';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Registra um novo usuário
   * POST /auth/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: RegisterData = req.body;

      // Validações básicas
      if (!registerData.nome || !registerData.email || !registerData.senha) {
        res.status(400).json({
          message: 'Nome, email e senha são obrigatórios'
        });
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        res.status(400).json({
          message: 'Email inválido'
        });
        return;
      }

      // Validação de senha
      if (registerData.senha.length < 6) {
        res.status(400).json({
          message: 'Senha deve ter no mínimo 6 caracteres'
        });
        return;
      }

      const authResponse = await this.userService.register(registerData);

      res.status(201).json({
        data: {
          id: authResponse.user.id,
          nome: authResponse.user.nome,
          email: authResponse.user.email,
          token: authResponse.token
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email já cadastrado') {
          res.status(409).json({
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        message: 'Erro ao registrar usuário'
      });
    }
  };

  /**
   * Autentica um usuário
   * POST /auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginCredentials = req.body;

      // Validações básicas
      if (!credentials.email || !credentials.senha) {
        res.status(400).json({
          message: 'Email e senha são obrigatórios'
        });
        return;
      }

      const authResponse = await this.userService.login(credentials);

      res.status(200).json({
        data: {
          id: authResponse.user.id,
          nome: authResponse.user.nome,
          email: authResponse.user.email,
          avatar: authResponse.user.avatar,
          token: authResponse.token
        }
      });
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Credenciais inválidas') {
          res.status(401).json({
            message: 'Email ou senha incorretos'
          });
          return;
        }
      }

      res.status(500).json({
        message: 'Erro ao fazer login'
      });
    }
  };

  /**
   * Obtém dados do usuário autenticado
   * GET /auth/me
   */
  public me = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          message: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        data: user
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao buscar dados do usuário'
      });
    }
  };

  /**
   * Atualiza perfil do usuário
   * PUT /users/profile
   */
  public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      const profileData: UpdateProfileData = {
        nome: req.body.nome,
        email: req.body.email,
        bio: req.body.bio,
        avatar: req.file ? req.file.filename : undefined,
        senha_atual: req.body.senha_atual,
        senha_nova: req.body.senha_nova
      };

      const updatedUser = await this.userService.updateProfile(userId, profileData);

      res.status(200).json({
        data: updatedUser
      });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('senha atual') || errorMessage.includes('obrigatória')) {
          res.status(400).json({
            message: error.message
          });
          return;
        }

        if (errorMessage.includes('incorreta')) {
          res.status(401).json({
            message: error.message
          });
          return;
        }

        if (errorMessage.includes('email já está em uso')) {
          res.status(409).json({
            message: error.message
          });
          return;
        }

        if (errorMessage.includes('não encontrado')) {
          res.status(404).json({
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        message: 'Erro ao atualizar perfil'
      });
    }
  };

  /**
   * Obtém estatísticas do usuário
   * GET /users/stats
   */
  public getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      const stats = await this.userService.getUserStats(userId);

      res.status(200).json({
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao buscar estatísticas'
      });
    }
  };

  /**
   * Busca um usuário por ID
   * GET /users/:id
   */
  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          message: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        data: user
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao buscar usuário'
      });
    }
  };

  /**
   * Lista todos os usuários
   * GET /users
   */
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();

      res.status(200).json({
        data: users
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao listar usuários'
      });
    }
  };

  /**
   * Atualiza um usuário
   * PUT /users/:id
   */
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updateData: Partial<RegisterData> = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      // Validação de email se fornecido
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          res.status(400).json({
            message: 'Email inválido'
          });
          return;
        }
      }

      // Validação de senha se fornecida
      if (updateData.senha && updateData.senha.length < 6) {
        res.status(400).json({
          message: 'Senha deve ter no mínimo 6 caracteres'
        });
        return;
      }

      const user = await this.userService.updateUser(id, updateData);

      res.status(200).json({
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          res.status(404).json({
            message: error.message
          });
          return;
        }
        if (error.message === 'Email já está em uso') {
          res.status(409).json({
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        message: 'Erro ao atualizar usuário'
      });
    }
  };

  /**
   * Deleta um usuário
   * DELETE /users/:id
   */
  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      await this.userService.deleteUser(id);

      res.status(200).json({
        data: {
          message: 'Usuário deletado com sucesso'
        }
      });
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          res.status(404).json({
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        message: 'Erro ao deletar usuário'
      });
    }
  };
}