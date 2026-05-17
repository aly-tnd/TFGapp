import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GestionUsuariosService } from '../../../services/usuario.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { exportarCSV } from '../../../shared/utils/csv-export.util';

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
    { field: 'muestra',       headerName: 'ID Muestra', flex: 1 },
    { field: 'espectrometro', headerName: 'Equipo',     flex: 1 },
    { field: 'sonda',         headerName: 'Sonda',      flex: 1 },
    {
      field: 'completo', headerName: 'Estado', flex: 0.5,
      cellRenderer: (p: any) => p.value ? 'Completado' : 'Pendiente'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private usuarioService: GestionUsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioService.getUsuarioConMuestras(id).subscribe({
        next: (data) => {
          this.usuario = data.usuario;
          this.muestras = data.muestras;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
  }

  exportarMuestras() {
    const datos = this.muestras.map(m => ({
      'ID Muestra':    m.muestra,
      'Espectrometro': m.espectrometro,
      'Sonda':         m.sonda,
      'Fecha':         m.fecha_entrada
                         ? new Date(m.fecha_entrada).toLocaleDateString('es-ES')
                         : '-',
      'Estado':        m.completo ? 'Completado' : 'Pendiente'
    }));
    const nombre = this.usuario?.nombre ?? 'usuario';
    exportarCSV(datos, `muestras_${nombre.toLowerCase().replace(/\s+/g, '_')}`);
  }
}
