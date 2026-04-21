import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // 1. Importar RouterLink

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet, 
    RouterLink // 2. Agregar RouterLink aquí para que funcionen los botones del HTML
    // Quita CrearUsuarioComponent de aquí, ya no lo necesitamos fijo
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Sistema de Gestión de Laboratorio';
}