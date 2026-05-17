import { Request, Response } from 'express';
import { CrearUsuarioUseCase } from '../../application/use-cases/create-user.use-cases';
import { ListUsersUseCase } from '../../application/use-cases/listar-usuarios.use-cases';
import { ObtenerUsuarioYMuestrasUseCase } from '../../application/use-cases/obtener-usuario-muestras.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RegistroRepository } from '../../domain/repositories/registro.repository';
import { AuthService } from '../../../../shared/services/auth.service';
import { AppError, asyncHandler } from '../../../../shared/middleware/error.middleware';
import { AuthRequest } from '../../../../shared/middleware/auth.middleware';

export class ApiController {
  constructor(
    private readonly createUserUseCase: CrearUsuarioUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly obtenerUsuarioYMuestrasUseCase: ObtenerUsuarioYMuestrasUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly userRepository: UserRepository,
    private readonly registroRepository: RegistroRepository,
    private readonly authService: AuthService
  ) {}

  // Crear nuevo usuario (admin)
  create = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, rol, username } = req.body;

    if (!email || !password || !name) {
      throw new AppError(400, 'Email, nombre y contraseña son requeridos');
    }

    const hashedPassword = await this.authService.hashPassword(password);
    const userEntity = new UserEntity(name, email, undefined, hashedPassword, rol || 'user', username);
    const result = await this.createUserUseCase.execute(userEntity);

    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: { id: result.id, name: result.nombre, email: result.email, rol: result.rol }
    });
  });

  // Listar todos los usuarios
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.listUsersUseCase.execute();
    res.json({
      message: 'Usuarios obtenidos exitosamente',
      data: users.map(u => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol }))
    });
  });

  // Obtener usuario con sus muestras
  getUserAndMuestras = asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.params.id);
    const data = await this.obtenerUsuarioYMuestrasUseCase.execute(userId);
    return res.status(200).json({ message: 'Usuario y muestras obtenidos', data });
  });

  // Registros del usuario autenticado
  getMisRegistros = asyncHandler(async (req: Request, res: Response) => {
    const { id } = (req as AuthRequest).user!;
    const registros = await this.registroRepository.findByUserId(id);
    return res.status(200).json({ message: 'Registros del usuario', data: registros });
  });

  // Todos los registros (admin)
  listarRegistros = asyncHandler(async (_req: Request, res: Response) => {
    const registros = await this.registroRepository.findAll();
    return res.status(200).json({ message: 'Registros obtenidos', data: registros });
  });

  // Crear registro de muestra
  createRegistro = asyncHandler(async (req: Request, res: Response) => {
    const registroData = req.body;
    if (!registroData.usuario_id || !registroData.muestra) {
      throw new AppError(400, 'usuario_id y muestra son requeridos');
    }
    const result = await this.registroRepository.crear(registroData);
    return res.status(201).json({ message: 'Registro creado exitosamente', data: result });
  });

  // Eliminar usuario por ID (solo admin)
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.params.id);
    if (!userId) throw new AppError(400, 'ID de usuario es requerido');
    await this.userRepository.borrar(userId);
    return res.status(200).json({ message: 'Usuario borrado correctamente' });
  });

  // Iniciar sesión
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError(400, 'Email y contraseña son requeridos');
    const result = await this.loginUseCase.execute({ email, password });
    return res.status(200).json({ message: 'Login exitoso', token: result.token, user: result.user });
  });

  // Actualizar perfil propio (username o contraseña)
  updatePerfil = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { id, email } = authReq.user!;
    const { username, currentPassword, newPassword } = req.body;

    // Cambio de contraseña: verificar la contraseña actual antes de actualizar
    if (newPassword) {
      if (!currentPassword) throw new AppError(400, 'La contraseña actual es requerida');
      const user = await this.userRepository.findByEmail(email);
      const isValid = await this.authService.comparePasswords(currentPassword, user.password || '');
      if (!isValid) throw new AppError(401, 'Contraseña actual incorrecta');
      const hashedPassword = await this.authService.hashPassword(newPassword);
      await this.userRepository.updateById(id, { password: hashedPassword });
    }

    if (username !== undefined) {
      await this.userRepository.updateById(id, { username });
    }

    return res.status(200).json({ message: 'Perfil actualizado correctamente' });
  });

  // Eliminar cuenta propia (solo usuarios normales, requiere contraseña)
  eliminarCuenta = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { id, email, rol } = authReq.user!;

    if (rol === 'admin') {
      throw new AppError(403, 'Los administradores no pueden eliminar su propia cuenta');
    }

    const { password } = req.body;
    if (!password) throw new AppError(400, 'La contraseña es requerida para confirmar la eliminación');

    const user = await this.userRepository.findByEmail(email);
    const isValid = await this.authService.comparePasswords(password, user.password || '');
    if (!isValid) throw new AppError(401, 'Contraseña incorrecta');

    await this.userRepository.borrar(id);
    return res.status(200).json({ message: 'Cuenta eliminada correctamente' });
  });
}
