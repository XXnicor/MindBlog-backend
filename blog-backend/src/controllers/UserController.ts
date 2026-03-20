import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { RegisterData, LoginCredentials, UpdateProfileData } from '../types';
import { AuthRequest } from '../types/AuthRequest';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

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

  public getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
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

  public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      // Gera a URL completa do avatar se houver upload
      let avatarUrl: string | undefined = undefined;
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const profileData: UpdateProfileData = {
        nome: req.body.nome,
        email: req.body.email,
        bio: req.body.bio,
        avatar: avatarUrl,
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

  public getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
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

  public getMyArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthRequest).user?.id;

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      const pageParam = parseInt(req.query.page as string, 10);
      const limitParam = parseInt(req.query.limit as string, 10);

      const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;
      const limit = Number.isInteger(limitParam) && limitParam >= 1 ? Math.min(limitParam, 100) : 10;

      const articles = await this.userService.getArticlesByUser(userId);

      const start = (page - 1) * limit;
      const paginated = articles.slice(start, start + limit);
      const totalItems = articles.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;

      const formatted = paginated.map((article: any) => ({
        ...article,
        autor: {
          id:     article.id_autor      ?? null,
          nome:   article.autor_nome    ?? null,
          email:  article.autor_email   ?? null,
          avatar: article.autor_avatar  ?? null,
          bio:    article.autor_bio     ?? null
        }
      }));

      res.status(200).json({
        articles: formatted,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error) {
      const err = error as Error;
      console.error('[UserController.getMyArticles] Erro:', err.message);
      res.status(500).json({
        error: 'internal_server_error',
        message: 'Erro ao buscar artigos do usuário'
      });
    }
  };

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