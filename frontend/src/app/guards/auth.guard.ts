import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta tu ruta

// Guard para el Admin (Solo entra si es rol 'admin')
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUsuarioActual();

  if (user?.rol === 'admin') return true;
  
  router.navigate(['/login']);
  return false;
};

// Guard para Usuarios normales (Entra si está logeado, sea quien sea)
export const userGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUsuarioActual();

  if (user) return true; 
  
  router.navigate(['/login']);
  return false;
};