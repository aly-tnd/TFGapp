import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // <-- Nuevo
import { MatCheckboxModule } from '@angular/material/checkbox'; // <-- Nuevo
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crear-registro',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule
  ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss']
})
export class CrearRegistroComponent {
  
  // 1. Diccionario estricto Espectrómetro -> Sondas
  public mapaEspectrometros: { [key: string]: string[] } = {
    'Espectrometro Bruker Avance NEO': [
      'PI HR BB400 (5mm)', 'PA BBI400 S1 (5mm)', 'PA BBI400 DIFF (5mm)'
    ],
    'Espectrometro Bruker Avance III / 500 (Muestras Líquidas)': [
      'PABBI (5mm)', 'PASEX (10mm)'
    ],
    'Espectrometro Bruker Avance NEO / HD (Muestras Sólidas)': [
      'SPRB400172_7164 (7.5 mm)', 'SPRB400172_7423 (7.5 mm)', 
      'H8906-20_007 (Triple resonancia)', 'H13664_0016 (2.5 mm)', 
      'H12138_0076 (Doble Resonancia)', 'H13349_0014 (Baja Frecuencia)'
    ]
  };

  public listaEspectrometros = Object.keys(this.mapaEspectrometros);
  public sondasDisponibles: string[] = [];

  // Objeto a enviar al backend
  public registro = {
    espectrometro: '',
    sonda: '',
    fechaEntrada: '',
    usuario: '',
    nombreMuestra: '',
    idSolicitud: '',
    finalizado: false,
    recuperarMuestra: false
  };

  // 2. Lógica de bloqueo
  actualizarSondas() {
    // Carga las sondas correspondientes
    this.sondasDisponibles = this.mapaEspectrometros[this.registro.espectrometro] || [];
    // Resetea la sonda elegida si se cambia el espectrómetro
    this.registro.sonda = ''; 
  }

  guardarMuestra() {
    console.log('Guardando...', this.registro);
    // Aquí tu llamada al servicio
  }
}