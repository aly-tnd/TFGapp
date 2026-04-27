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

  constructor(private authService: AuthService, private router: Router) {}

  entrar() {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.rol === 'admin') {
          this.router.navigate(['/usuarios']); // Cambia a la ruta de tu lista
        } else {
          this.router.navigate(['/nueva-muestra']); // Cambia a la ruta de crear muestra
        }
      },
      error: () => this.error = 'Email o contraseña incorrectos'
    });
  }
}