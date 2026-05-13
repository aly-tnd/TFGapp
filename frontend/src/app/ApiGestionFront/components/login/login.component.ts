import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  entrar(): void {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Email y contraseña son requeridos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Email inválido';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        if (!user || !user.rol) {
          this.error = 'Email o contraseña incorrectos';
          return;
        }

        if (user.rol === 'admin') {
          this.router.navigate(['/listar-usuarios']);
        } else {
          this.router.navigate(['/nuevo-registro']);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Email o contraseña incorrectos';
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.entrar();
    }
  }
}