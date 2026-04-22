import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Módulos de Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'] // <--- Asegúrate de que termina en .scss
})
export class MenuComponent {
  // Lógica del menú
}