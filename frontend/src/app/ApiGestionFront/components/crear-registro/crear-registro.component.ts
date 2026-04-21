import { Component, OnInit } from '@angular/core';
import { EspectrometroService } from '../../../services/espectrometro.service';
import { RegistroService } from '../../../services/registro.service';
// ... imports de siempre

export class CrearRegistroComponent implements OnInit {
  espectrometros: any[] = [];
  sondasDisponibles: string[] = [];
  
  // Modelo de la muestra
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

  constructor(private espService: EspectrometroService, private regService: RegistroService) {}

  ngOnInit() {
    this.espService.listar().subscribe((data: any[]) => this.espectrometros = data);
  }

  // Al elegir equipo en el HTML, filtramos sus sondas
  cambiarEspectrometro(event: any) {
    const seleccionado = this.espectrometros.find(e => e._id === this.registro.espectrometro);
    this.sondasDisponibles = seleccionado ? seleccionado.sondas : [];
  }

  guardar() {
    this.regService.crear(this.registro).subscribe(() => alert('Registro creado'));
  }
}