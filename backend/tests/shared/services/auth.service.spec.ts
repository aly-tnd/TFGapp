import { AuthService } from '../../../src/shared/services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('generateToken', () => {
    it('debe generar un token válido', () => {
      const payload = { id: '123', email: 'test@example.com', rol: 'user' };
      const token = authService.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT tiene 3 partes
    });

    it('debe poder verificar un token generado', () => {
      const payload = { id: '123', email: 'test@example.com', rol: 'user' };
      const token = authService.generateToken(payload);
      const verified = authService.verifyToken(token);

      expect(verified.id).toBe(payload.id);
      expect(verified.email).toBe(payload.email);
      expect(verified.rol).toBe(payload.rol);
    });
  });

  describe('hashPassword', () => {
    it('debe hashear una contraseña', async () => {
      const password = 'password123';
      const hashed = await authService.hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password); // No debe ser igual
    });

    it('dos contraseñas iguales deben producir hashes diferentes', async () => {
      const password = 'password123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePasswords', () => {
    it('debe retornar true si las contraseñas coinciden', async () => {
      const password = 'password123';
      const hashed = await authService.hashPassword(password);
      const result = await authService.comparePasswords(password, hashed);

      expect(result).toBe(true);
    });

    it('debe retornar false si las contraseñas no coinciden', async () => {
      const password = 'password123';
      const hashed = await authService.hashPassword(password);
      const result = await authService.comparePasswords('differentpassword', hashed);

      expect(result).toBe(false);
    });
  });

  describe('verifyToken', () => {
    it('debe lanzar error si el token es inválido', () => {
      expect(() => authService.verifyToken('invalid_token')).toThrow();
    });
  });
});
