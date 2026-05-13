import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthService } from '../../../../shared/services/auth.service';
import { AppError } from '../../../../shared/middleware/error.middleware';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    username?: string;
    email: string;
    rol: string;
  };
}

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError(401, 'Credenciales inválidas');

    const isPasswordValid = await this.authService.comparePasswords(password, user.password || '');
    if (!isPasswordValid) throw new AppError(401, 'Credenciales inválidas');

    const token = this.authService.generateToken({
      id: user._id?.toString() || '',
      email: user.email,
      rol: user.rol || 'user'
    });

    return {
      token,
      user: {
        id: user._id?.toString() || '',
        nombre: user.name || '',
        username: user.username || undefined,
        email: user.email,
        rol: user.rol || 'user'
      }
    };
  }
}
