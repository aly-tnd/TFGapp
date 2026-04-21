import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  // Estas variables enlazan con el HTML
  nombre: string = '';
  email: string = '';

  guardarUsuario() {
    console.log('Guardando usuario:', this.nombre, this.email);
    alert('Usuario guardado (simulado): ' + this.nombre);
  }
}