import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspectrometroService } from '../../../services/espectrometro.service';
import { RegistroService } from '../../../services/registro.service';


@Component({
  selector: 'app-crear-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.css']
}) // <-- ¡ASEGÚRATE DE QUE AQUÍ NO HAYA UN PUNTO Y COMA ( ; )!
export class CrearRegistroComponent implements OnInit {
  // ... resto del código
  espectrometros: any[] = [];
  sondasDisponibles: string[] = [];

  registro = {
    espectrometro: '',
    sonda: '',
    fechaEntrada: new Date().toISOString().split('T')[0],
    usuarioEntrada: '',
    muestra: '',
    idSolicitud: '',
    finalizado: false,
    recuperarMuestra: false
  };

  constructor(
    private espService: EspectrometroService, 
    private regService: RegistroService
  ) {}

  ngOnInit() {
    this.espService.listar().subscribe((data: any[]) => {
      this.espectrometros = data;
    });
  }

  cambiarEspectrometro() {
    const seleccionado = this.espectrometros.find(e => e._id === this.registro.espectrometro);
    this.sondasDisponibles = seleccionado ? seleccionado.sondas : [];
  }

  guardar() {
    this.regService.crear(this.registro).subscribe(() => {
      alert('Guardado');
    });
  }
}