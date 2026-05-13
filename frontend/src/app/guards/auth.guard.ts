import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guarda para rutas exclusivas de administrador
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  if (authService.hasRole('admin')) return true;

  router.navigate(['/nuevo-registro']);
  return false;
};

// Guarda para rutas exclusivas de usuario normal
export const userGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  if (authService.hasRole('user')) return true;

  router.navigate(['/listar-usuarios']);
  return false;
};

// Guarda para rutas que requieren sesión iniciada (cualquier rol)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
