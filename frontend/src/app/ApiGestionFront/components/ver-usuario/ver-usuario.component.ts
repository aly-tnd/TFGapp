import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GestionUsuariosService } from '../../../services/usuario.service';

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
    private usuarioService: GestionUsuariosService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioService.getUsuarioConMuestras(id).subscribe({
        next: (data) => {
          this.usuario = data.usuario;
          this.muestras = data.muestras;
        },
        error: (err) => console.error('Error al cargar datos:', err)
      });
    }
  }
}