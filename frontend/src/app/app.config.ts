import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router'; // Importar router
import { provideHttpClient } from '@angular/common/http'; // Importar HTTP
import { CrearEspectrometroComponent } from './ApiGestionFront/components/crear-espectrometro/crear-espectrometro.component';
import { CrearUsuarioComponent } from './ApiGestionFront/components/crear-usuario/crear-usuario.component';
import { CrearRegistroComponent } from './ApiGestionFront/components/crear-registro/crear-registro.component';


const routes: Routes = [
  { path: 'nuevo-usuario', component: CrearUsuarioComponent },
  { path: 'nuevo-espectrometro', component: CrearEspectrometroComponent },
  { path: 'nuevo-registro', component: CrearRegistroComponent }, // <--- FALTABA ESTA COMA
  { path: '', redirectTo: '/nuevo-usuario', pathMatch: 'full' } 
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),   // Configurar rutas
    provideHttpClient()      // Habilitar peticiones al backend
  ]
};