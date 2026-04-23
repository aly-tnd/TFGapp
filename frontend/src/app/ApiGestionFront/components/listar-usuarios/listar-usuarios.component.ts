import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Ag-Grid
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Tus modelos y servicios
import { Usuario } from '../../class/usuario';
import { GestionUsuariosService } from '../../../services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  // IMPORTANTE: Hay que declarar aquí todos los módulos que usa tu HTML
  imports: [
    CommonModule, 
    RouterLink, 
    AgGridModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {
  
  // Datos para la tabla
  public usuarios: Usuario[] = [];

  // Configuración de las columnas de Ag-Grid
  public columnDefs: ColDef[] = [
    // Cambia field: 'name' a field: 'nombre'
    { field: 'nombre', headerName: 'Nombre', flex: 1, sortable: true, filter: true },
    { field: 'email', headerName: 'Correo Electrónico', flex: 1, sortable: true, filter: true }
  ];

  constructor(private usuarioService: GestionUsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios recibidos:', data);
      },
      error: (err) => {
        console.error('Error al traer usuarios:', err);
      }
    });
  }

  // Ajusta las columnas al ancho de la pantalla cuando la tabla carga
  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }
}