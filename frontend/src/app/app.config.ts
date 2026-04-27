import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { CrearEspectrometroComponent } from './ApiGestionFront/components/crear-espectrometro/crear-espectrometro.component';
import { CrearUsuarioComponent } from './ApiGestionFront/components/crear-usuario/crear-usuario.component';
import { CrearRegistroComponent } from './ApiGestionFront/components/crear-registro/crear-registro.component';
import { ListaUsuariosComponent } from './ApiGestionFront/components/listar-usuarios/listar-usuarios.component';
import { VerUsuarioComponent } from './ApiGestionFront/components/ver-usuario/ver-usuario.component';

// 1. IMPORTA EL LOGIN Y LOS GUARDS (Ajusta las rutas a tus carpetas)
import { LoginComponent } from './ApiGestionFront/components/login/login.component';
import { adminGuard, userGuard } from './guards/auth.guard';

const routes: Routes = [
  // Ruta pública
  { path: 'login', component: LoginComponent },

  // Rutas de ADMIN (Protegidas)
  { path: 'listar-usuarios', component: ListaUsuariosComponent, canActivate: [adminGuard] },
  { path: 'nuevo-usuario', component: CrearUsuarioComponent, canActivate: [adminGuard] },
  { path: 'nuevo-espectrometro', component: CrearEspectrometroComponent, canActivate: [adminGuard] },
  { path: 'usuario/:id', component: VerUsuarioComponent, canActivate: [adminGuard] },
  
  // Ruta de USUARIO NORMAL (Protegida)
  { path: 'nuevo-registro', component: CrearRegistroComponent, canActivate: [userGuard] },
   
  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Si escribe una URL que no existe, al login
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
