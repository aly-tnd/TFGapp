import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';

import { CrearEspectrometroComponent } from './ApiGestionFront/components/crear-espectrometro/crear-espectrometro.component';
import { CrearUsuarioComponent } from './ApiGestionFront/components/crear-usuario/crear-usuario.component';
import { CrearRegistroComponent } from './ApiGestionFront/components/crear-registro/crear-registro.component';
import { ListaUsuariosComponent } from './ApiGestionFront/components/listar-usuarios/listar-usuarios.component';
import { VerUsuarioComponent } from './ApiGestionFront/components/ver-usuario/ver-usuario.component';
import { LoginComponent } from './ApiGestionFront/components/login/login.component';
import { AjustesCuentaComponent } from './ApiGestionFront/components/ajustes-cuenta/ajustes-cuenta.component';

import { adminGuard, userGuard, authGuard } from './guards/auth.guard';
import { AuthHttpInterceptor } from './shared/interceptors/auth.interceptor';

const routes: Routes = [
  // Pública
  { path: 'login', component: LoginComponent },

  // Ajustes de cuenta (cualquier usuario autenticado)
  { path: 'ajustes-cuenta', component: AjustesCuentaComponent, canActivate: [authGuard] },

  // Rutas de ADMIN
  { path: 'listar-usuarios',     component: ListaUsuariosComponent,     canActivate: [adminGuard] },
  { path: 'nuevo-usuario',       component: CrearUsuarioComponent,       canActivate: [adminGuard] },
  { path: 'nuevo-espectrometro', component: CrearEspectrometroComponent, canActivate: [adminGuard] },
  { path: 'usuario/:id',         component: VerUsuarioComponent,         canActivate: [adminGuard] },

  // Ruta de USUARIO NORMAL
  { path: 'nuevo-registro', component: CrearRegistroComponent, canActivate: [userGuard] },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ]
};
