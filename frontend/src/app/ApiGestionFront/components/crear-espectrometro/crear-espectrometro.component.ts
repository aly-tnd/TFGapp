import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspectrometroService } from '../../../services/espectrometro.service';


@Component({
  selector: 'app-crear-espectrometro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-espectrometro.component.html',
  styleUrls: ['./crear-espectrometro.component.css']
})
export class CrearEspectrometroComponent {
  nombre: string = '';
  sondasInput: string = ''; // Recibe texto separado por comas

  constructor(private espectrometroService: EspectrometroService) {}

  guardarEspectrometro() {
    // Convierte el string separado por comas en un array limpio
    const sondasArray = this.sondasInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const datos = { nombre: this.nombre, sondas: sondasArray };

    this.espectrometroService.crear(datos).subscribe({
      next: () => {
        alert('Espectrómetro creado correctamente');
        this.nombre = '';
        this.sondasInput = '';
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al guardar');
      }
    });
  }
}