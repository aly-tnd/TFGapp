import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// Importación con llaves y ruta exacta (respetando mayúsculas)
import { MenuComponent } from './ApiGestionFront/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    MenuComponent // <--- Se añade aquí para poder usar <app-menu> en el HTML
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css'] // <--- Cambiado para que coincida con tu archivo app.css
})
export class AppComponent {
  title = 'frontend';
}

