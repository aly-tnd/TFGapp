import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GestionUsuariosService } from "../../../services/usuario.service";

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent {
  public usuario = {
    name: '',
    username: '',
    email: '',
    password: '',
    rol: 'user',
    labData: {}
  };

  constructor(private usuarioService: GestionUsuariosService) {}

  guardarUsuario(): void {
    console.log('Enviando al backend:', this.usuario);

    this.usuarioService.crearUsuario(this.usuario).subscribe({
      next: (res) => {
        alert('✅ ¡Usuario guardado con éxito!');
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('❌ Error en la petición:', err);
        alert('Hubo un error al guardar');
      }
    });
  }

  private limpiarFormulario() {
    this.usuario = { name: '', username: '', email: '', password: '', rol: 'user', labData: {} };
  }
}