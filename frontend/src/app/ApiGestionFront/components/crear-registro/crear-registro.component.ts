import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // <-- Nuevo
import { MatCheckboxModule } from '@angular/material/checkbox'; // <-- Nuevo
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core'; // <-- Añade OnInit
import { GestionUsuariosService } from '../../../services/usuario.service';
import { RegistroService } from '../../../services/registro.service';

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

  public listaUsuarios: any[] = [];

  constructor(
    private usuarioService: GestionUsuariosService,
    private registroService: RegistroService
  ) {}

  ngOnInit() {
    this.usuarioService.listar().subscribe({
      next: (users) => this.listaUsuarios = users,
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  actualizarSondas() {
    this.sondasDisponibles = this.mapaEspectrometros[this.registro.espectrometro] || [];
    this.registro.sonda = ''; 
  }

  guardarMuestra() {
    const payload = {
      espectrometro: this.registro.espectrometro,
      sonda: this.registro.sonda,
      usuario_id: this.registro.usuario,        // Traducimos usuario -> usuario_id
      fecha_entrada: this.registro.fechaEntrada,// Traducimos fechaEntrada -> fecha_entrada
      muestra: this.registro.nombreMuestra,     // Traducimos nombreMuestra -> muestra
      completo: this.registro.finalizado        // Traducimos finalizado -> completo
    };

    console.log('Enviando al backend...', payload);
    
    this.registroService.crear(payload).subscribe({
      next: (res: any) => {
        alert('Muestra guardada con éxito');
      },
      error: (err: any) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar la muestra');
      }
    });
  }
}