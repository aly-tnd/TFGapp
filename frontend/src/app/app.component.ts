import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './ApiGestionFront/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css'] // <--- Cambiado para que coincida con tu archivo app.css
})
export class AppComponent {
  title = 'frontend';
}

