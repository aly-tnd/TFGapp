import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, AuthUser } from '../../../services/auth.service';

@Component({
  selector: 'app-ajustes-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes-cuenta.component.html',
  styleUrls: ['./ajustes-cuenta.component.scss']
})
export class AjustesCuentaComponent implements OnInit {
  usuarioActual: AuthUser | null = null;
  esAdmin = false;

  // Cambio de nombre de usuario
  nuevoUsername = '';
  mensajeUsername = '';
  errorUsername = false;

  // Cambio de contraseña
  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';
  mensajePassword = '';
  errorPassword = false;

  // Eliminación de cuenta
  mostrarConfirmEliminar = false;
  passwordEliminar = '';
  errorEliminar = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.esAdmin = this.authService.hasRole('admin');
  }

  cambiarUsername() {
    if (!this.nuevoUsername.trim()) return;

    this.authService.updateUsername(this.nuevoUsername.trim()).subscribe({
      next: () => {
        this.mensajeUsername = 'Nombre de usuario actualizado correctamente';
        this.errorUsername = false;
        // Actualiza la vista con el nuevo valor
        this.usuarioActual = this.authService.getUsuarioActual();
        this.nuevoUsername = '';
      },
      error: () => {
        this.mensajeUsername = 'Error al actualizar el nombre de usuario';
        this.errorUsername = true;
      }
    });
  }

  cambiarPassword() {
    this.mensajePassword = '';

    if (!this.passwordActual || !this.nuevaPassword || !this.confirmarPassword) {
      this.mensajePassword = 'Todos los campos son requeridos';
      this.errorPassword = true;
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensajePassword = 'Las contraseñas nuevas no coinciden';
      this.errorPassword = true;
      return;
    }

    this.authService.changePassword(this.passwordActual, this.nuevaPassword).subscribe({
      next: () => {
        this.mensajePassword = 'Contraseña actualizada correctamente';
        this.errorPassword = false;
        this.passwordActual = '';
        this.nuevaPassword = '';
        this.confirmarPassword = '';
      },
      error: (err) => {
        this.mensajePassword = err?.error?.message || 'Error al cambiar la contraseña';
        this.errorPassword = true;
      }
    });
  }

  abrirConfirmEliminar() {
    this.passwordEliminar = '';
    this.errorEliminar = '';
    this.mostrarConfirmEliminar = true;
  }

  eliminarCuenta() {
    if (!this.passwordEliminar) {
      this.errorEliminar = 'Introduce tu contraseña para confirmar';
      return;
    }

    this.authService.deleteAccount(this.passwordEliminar).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorEliminar = err?.error?.message || 'Contraseña incorrecta';
      }
    });
  }
}
