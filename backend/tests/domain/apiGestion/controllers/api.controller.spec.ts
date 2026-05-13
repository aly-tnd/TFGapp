import { ApiController } from '../../../src/domain/apiGestion/http/controllers/api.controller';
import { CreateUserUseCase } from '../../../src/domain/apiGestion/application/use-cases/create-user.use-cases';
import { ListUsersUseCase } from '../../../src/domain/apiGestion/application/use-cases/listar-usuarios.use-cases';
import { ObtenerUsuarioYMuestrasUseCase } from '../../../src/domain/apiGestion/application/use-cases/obtener-usuario-muestras.use-case';
import { LoginUseCase } from '../../../src/domain/apiGestion/application/use-cases/login.use-case';
import { UserRepository } from '../../../src/domain/apiGestion/domain/repositories/user.repository';
import { RegistroRepository } from '../../../src/domain/apiGestion/domain/repositories/registro.repository';
import { AuthService } from '../../../src/shared/services/auth.service';
import { Request, Response } from 'express';

// Mock del repositorio
const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  borrar: jest.fn()
};

const mockRegistroRepository: jest.Mocked<RegistroRepository> = {
  findByUserId: jest.fn()
};

const mockAuthService = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  hashPassword: jest.fn(),
  comparePasswords: jest.fn()
} as jest.Mocked<Partial<AuthService>> as any;

describe('ApiController', () => {
  let controller: ApiController;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    const createUserUseCase = new CreateUserUseCase(mockUserRepository);
    const listUsersUseCase = new ListUsersUseCase(mockUserRepository);
    const obtenerUseCase = new ObtenerUsuarioYMuestrasUseCase(
      mockUserRepository,
      mockRegistroRepository
    );
    const loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService as any);

    controller = new ApiController(
      createUserUseCase,
      listUsersUseCase,
      obtenerUseCase,
      loginUseCase,
      mockUserRepository,
      mockRegistroRepository,
      mockAuthService as any
    );

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe retornar token y usuario en login exitoso', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashed_password',
        nombre: 'Test User',
        rol: 'user'
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockAuthService.comparePasswords.mockResolvedValue(true);
      mockAuthService.generateToken.mockReturnValue('test_token');

      const mockReq = {
        body: { email: 'test@example.com', password: 'password' }
      } as Request;

      await controller.login(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('debe retornar 400 si falta email o contraseña', async () => {
      const mockReq = {
        body: { email: 'test@example.com' }
      } as Request;

      try {
        await controller.login(mockReq, mockRes as Response);
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('create', () => {
    it('debe crear un usuario exitosamente', async () => {
      const mockReq = {
        body: {
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
          rol: 'user'
        }
      } as Request;

      mockAuthService.hashPassword.mockResolvedValue('hashed_password');
      mockUserRepository.save.mockResolvedValue({
        id: '123',
        nombre: 'New User',
        email: 'new@example.com',
        password: 'hashed_password',
        rol: 'user'
      });

      await controller.create(mockReq, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('debe retornar 400 si faltan datos requeridos', async () => {
      const mockReq = {
        body: { name: 'Test' }
      } as Request;

      try {
        await controller.create(mockReq, mockRes as Response);
      } catch (error: any) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('getAll', () => {
    it('debe retornar lista de usuarios', async () => {
      const mockUsers = [
        { id: '1', nombre: 'User 1', email: 'user1@example.com', rol: 'user' },
        { id: '2', nombre: 'User 2', email: 'user2@example.com', rol: 'admin' }
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const mockReq = {} as Request;

      await controller.getAll(mockReq, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
