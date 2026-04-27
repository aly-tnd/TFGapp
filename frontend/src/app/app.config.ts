import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { CrearEspectrometroComponent } from './ApiGestionFront/components/crear-espectrometro/crear-espectrometro.component';
import { CrearUsuarioComponent } from './ApiGestionFront/components/crear-usuario/crear-usuario.component';
import { CrearRegistroComponent } from './ApiGestionFront/components/crear-registro/crear-registro.component';
// 1. IMPORTA TU NUEVO COMPONENTE
import { ListaUsuariosComponent } from './ApiGestionFront/components/listar-usuarios/listar-usuarios.component';
import { VerUsuarioComponent } from './ApiGestionFront/components/ver-usuario/ver-usuario.component';

const routes: Routes = [
  { path: 'nuevo-usuario', component: CrearUsuarioComponent },
  { path: 'nuevo-espectrometro', component: CrearEspectrometroComponent },
  { path: 'nuevo-registro', component: CrearRegistroComponent },
  // 2. AÑADE LA RUTA PARA LISTAR
  { path: 'listar-usuarios', component: ListaUsuariosComponent },
  { path: 'usuario/:id', component: VerUsuarioComponent }, // :id es dinámico
   
  { path: '', redirectTo: '/nuevo-usuario', pathMatch: 'full' } 
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};