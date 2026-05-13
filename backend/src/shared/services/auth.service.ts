import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface AuthToken {
  id: string;
  email: string;
  rol: string;
}

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'tu-secreto-seguro';
  private readonly jwtExpiration = process.env.JWT_EXPIRATION || '24h';

  generateToken(payload: AuthToken): string {
    const options: SignOptions = {
      expiresIn: this.jwtExpiration as any
    };
    return jwt.sign(payload, this.jwtSecret, options);
  }

  verifyToken(token: string): AuthToken {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthToken;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
