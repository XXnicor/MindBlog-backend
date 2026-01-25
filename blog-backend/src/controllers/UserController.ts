// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { RegisterData, LoginCredentials, AuthRequest } from '../types';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Registra um novo usuário
   * POST /users/register
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: RegisterData = req.body;

      // Validações básicas
      if (!registerData.nome || !registerData.email || !registerData.senha) {
        res.status(400).json({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        });
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
        return;
      }

      // Validação de senha
      if (registerData.senha.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Senha deve ter no mínimo 6 caracteres'
        });
        return;
      }

      const user = await this.userService.register(registerData);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email já cadastrado') {
          res.status(409).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuário'
      });
    }
  };

  /**
   * Autentica um usuário
   * POST /users/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginCredentials = req.body;

      // Validações básicas
      if (!credentials.email || !credentials.senha) {
        res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
        return;
      }

      const authResponse = await this.userService.login(credentials);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: authResponse
      });
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Credenciais inválidas') {
          res.status(401).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao fazer login'
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
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
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
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
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
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      // Validação de email se fornecido
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          res.status(400).json({
            success: false,
            message: 'Email inválido'
          });
          return;
        }
      }

      // Validação de senha se fornecida
      if (updateData.senha && updateData.senha.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Senha deve ter no mínimo 6 caracteres'
        });
        return;
      }

      const user = await this.userService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
        if (error.message === 'Email já está em uso') {
          res.status(409).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
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
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      await this.userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Usuário não encontrado') {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao deletar usuário'
      });
    }
  };
}