import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { MenuComponent } from './ApiGestionFront/components/menu/menu.component';
import { AuthService, AuthUser } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  usuarioActual: AuthUser | null = null;
  mostrarDropdown = false;
  mostrarConfirmLogout = false;
  private sub: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  get estaLogado(): boolean {
    return this.usuarioActual !== null;
  }

  // Muestra el username si existe, si no el nombre completo
  get nombreVisible(): string {
    return this.usuarioActual?.username || this.usuarioActual?.nombre || '';
  }

  ngOnInit() {
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  irAjustes() {
    this.mostrarDropdown = false;
    this.router.navigate(['/ajustes-cuenta']);
  }

  iniciarCerrarSesion() {
    this.mostrarDropdown = false;
    this.mostrarConfirmLogout = true;
  }

  confirmarLogout() {
    this.mostrarConfirmLogout = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancelarLogout() {
    this.mostrarConfirmLogout = false;
  }

  // Cierra el dropdown al hacer clic fuera del menú de usuario
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.mostrarDropdown = false;
    }
  }
}
