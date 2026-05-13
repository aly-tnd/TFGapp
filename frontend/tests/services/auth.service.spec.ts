import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService, LoginResponse } from '../../../src/app/services/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, value: string) => {
        localStorageMock[key] = value;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
      clear: () => {
        localStorageMock = {};
      }
    });

    // Crear una instancia de AuthService sin inyectaor HTTP
    service = new AuthService(null as any);
  });

  describe('getToken', () => {
    it('debe retornar null si no hay token almacenado', () => {
      const token = service.getToken();
      expect(token).toBeNull();
    });

    it('debe retornar el token si está almacenado', () => {
      const testToken = 'test_jwt_token';
      localStorageMock['auth_token'] = testToken;
      const token = service.getToken();
      expect(token).toBe(testToken);
    });
  });

  describe('getUsuarioActual', () => {
    it('debe retornar null si no hay usuario almacenado', () => {
      const user = service.getUsuarioActual();
      expect(user).toBeNull();
    });

    it('debe retornar el usuario si está almacenado', () => {
      const testUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        rol: 'user'
      };
      localStorageMock['usuario_logeado'] = JSON.stringify(testUser);
      const user = service.getUsuarioActual();
      expect(user).toEqual(testUser);
    });
  });

  describe('cerrarSesion', () => {
    it('debe limpiar el almacenamiento local', () => {
      localStorageMock['auth_token'] = 'test_token';
      localStorageMock['usuario_logeado'] = JSON.stringify({});
      
      service.cerrarSesion();
      
      expect(localStorageMock['auth_token']).toBeUndefined();
      expect(localStorageMock['usuario_logeado']).toBeUndefined();
    });
  });

  describe('isAuthenticated', () => {
    it('debe retornar false si no hay token', () => {
      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });

    it('debe retornar false si hay token pero no hay usuario', () => {
      localStorageMock['auth_token'] = 'test_token';
      const result = service.isAuthenticated();
      expect(result).toBe(false);
    });

    it('debe retornar true si hay token y usuario', () => {
      localStorageMock['auth_token'] = 'test_token';
      localStorageMock['usuario_logeado'] = JSON.stringify({
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        rol: 'user'
      });
      const result = service.isAuthenticated();
      expect(result).toBe(true);
    });
  });

  describe('hasRole', () => {
    it('debe retornar true si el usuario tiene el rol especificado', () => {
      localStorageMock['usuario_logeado'] = JSON.stringify({
        id: '123',
        name: 'Admin User',
        email: 'admin@example.com',
        rol: 'admin'
      });
      const result = service.hasRole('admin');
      expect(result).toBe(true);
    });

    it('debe retornar false si el usuario no tiene el rol especificado', () => {
      localStorageMock['usuario_logeado'] = JSON.stringify({
        id: '123',
        name: 'Regular User',
        email: 'user@example.com',
        rol: 'user'
      });
      const result = service.hasRole('admin');
      expect(result).toBe(false);
    });
  });
});
