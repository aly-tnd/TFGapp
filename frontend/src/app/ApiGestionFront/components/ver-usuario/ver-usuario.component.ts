import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GestionUsuariosService } from '../../../services/usuario.service'; // Ajusta la ruta si es necesario
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ver-usuario',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './ver-usuario.component.html',
  styleUrl: './ver-usuario.component.scss'
})
export class VerUsuarioComponent implements OnInit {
  public usuario: any = null;
  public muestras: any[] = [];

  public columnDefs: ColDef[] = [
    { field: 'muestra', headerName: 'ID Muestra', flex: 1 },
    { field: 'espectrometro', headerName: 'Equipo', flex: 1 },
    { field: 'sonda', headerName: 'Sonda', flex: 1 },
    { field: 'completo', headerName: 'Estado', flex: 0.5, cellRenderer: (p: any) => p.value ? '✅ Completo' : '⏳ Pendiente' }
  ];

  constructor(
    private route: ActivatedRoute,
    private usuarioService: GestionUsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('1. ID de la URL capturado:', id);

    if (id) {
      console.log('2. Llamando al backend...');
      this.usuarioService.getUsuarioConMuestras(id).subscribe({
        next: (data) => {
          console.log('3. Respuesta del backend:', data);
          this.usuario = data.usuario;
          this.muestras = data.muestras;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('3. Error al llamar al backend:', err);
        }
      });
    }
  }
}