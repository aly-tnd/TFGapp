import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Usuario } from '../../class/usuario';
import { GestionUsuariosService } from '../../../services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
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
  
  public usuarios: Usuario[] = [];
  private gridApi: any; // <-- 1. Variable para manejar la tabla

  public columnDefs: ColDef[] = [
    { field: 'nombre', headerName: 'Nombre', flex: 1, checkboxSelection: true }, // <-- 2. Añadido el checkbox
    { field: 'email', headerName: 'Correo Electrónico', flex: 1 },
    { 
      colId: 'acciones',
      headerName: 'Acciones', 
      flex: 0.5,
      minWidth: 120,
      valueGetter: () => 'Ver Muestras',
      cellStyle: { color: '#1976d2', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' },
      onCellClicked: (params: any) => {
        const userId = params.data.id || params.data._id;
        window.location.href = `/usuario/${userId}`;
      }
    }
  ];

  constructor(private usuarioService: GestionUsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error al traer usuarios:', err)
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api; // <-- 3. Guardamos la instancia de la tabla
  }

  // <-- 4. Función ejecutada por el botón HTML
  borrarUsuarios() {
    const seleccionados = this.gridApi.getSelectedRows();
    
    if (seleccionados.length === 0) {
      alert('Por favor, selecciona al menos un usuario de la tabla.');
      return;
    }

    const id = seleccionados[0].id || seleccionados[0]._id;
    
    if(confirm(`¿Seguro que quieres borrar a ${seleccionados[0].nombre}?`)) {
      this.usuarioService.borrarUsuario(id).subscribe({
        next: () => {
          alert('Usuario borrado correctamente');
          this.cargarUsuarios(); // Refresca la tabla automáticamente
        },
        error: (err) => {
          console.error('Error al borrar:', err);
          alert('Error al borrar el usuario');
        }
      });
    }
  }
}