import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GestionUsuariosService } from '../../../services/usuario.service';
import { exportarCSV } from '../../../shared/utils/csv-export.util';

@Component({
  selector: 'app-ver-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './ver-usuario.component.html',
  styleUrl: './ver-usuario.component.scss'
})
export class VerUsuarioComponent implements OnInit {
  usuario: any = null;
  muestras: any[] = [];
  filtroVisible = false;

  filtros = {
    muestra:       '',
    espectrometro: '',
    sonda:         '',
    estado:        '',
    fechaDesde:    '',
    fechaHasta:    ''
  };

  readonly tamanosPagina = [5, 10, 20, 50, 100];
  pagina       = 1;
  tamanoPagina = 5;

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
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
  }

  get espectrometrosDisponibles(): string[] {
    return [...new Set(this.muestras.map(m => m.espectrometro).filter(Boolean))];
  }

  get sondasDisponibles(): string[] {
    const base = this.filtros.espectrometro
      ? this.muestras.filter(m => m.espectrometro === this.filtros.espectrometro)
      : this.muestras;
    return [...new Set(base.map(m => m.sonda).filter(Boolean))];
  }

  get muestrasFiltradas(): any[] {
    return this.muestras.filter(m => {
      if (this.filtros.muestra &&
          !m.muestra?.toLowerCase().includes(this.filtros.muestra.toLowerCase())) return false;
      if (this.filtros.espectrometro && m.espectrometro !== this.filtros.espectrometro) return false;
      if (this.filtros.sonda && m.sonda !== this.filtros.sonda) return false;
      if (this.filtros.estado !== '') {
        if (m.completo !== (this.filtros.estado === 'true')) return false;
      }
      if (this.filtros.fechaDesde) {
        if (new Date(m.fecha_entrada) < new Date(this.filtros.fechaDesde)) return false;
      }
      if (this.filtros.fechaHasta) {
        const hasta = new Date(this.filtros.fechaHasta);
        hasta.setHours(23, 59, 59);
        if (new Date(m.fecha_entrada) > hasta) return false;
      }
      return true;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.muestrasFiltradas.length / this.tamanoPagina) || 1;
  }

  get muestrasPagina(): any[] {
    const inicio = (this.pagina - 1) * this.tamanoPagina;
    return this.muestrasFiltradas.slice(inicio, inicio + this.tamanoPagina);
  }

  get rangoInicio(): number {
    return this.muestrasFiltradas.length === 0 ? 0 : (this.pagina - 1) * this.tamanoPagina + 1;
  }

  get rangoFin(): number {
    return Math.min(this.pagina * this.tamanoPagina, this.muestrasFiltradas.length);
  }

  get paginasVisibles(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.pagina - 2); i <= Math.min(this.totalPaginas, this.pagina + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  cambiarPagina(n: number) {
    this.pagina = Math.max(1, Math.min(n, this.totalPaginas));
  }

  cambiarTamano(t: number) {
    this.tamanoPagina = Number(t);
    this.pagina = 1;
  }

  aplicarFiltro() { this.pagina = 1; }

  limpiarFiltros() {
    this.filtros = { muestra: '', espectrometro: '', sonda: '', estado: '', fechaDesde: '', fechaHasta: '' };
    this.pagina = 1;
  }

  formatFecha(fechaStr: string | Date): string {
    if (!fechaStr) return '-';
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(fechaStr));
  }

  // Exporta todos los registros del usuario sin respetar filtros ni paginacion
  exportarMuestras() {
    const nombre = this.usuario?.nombre ?? 'usuario';
    const datos = this.muestras.map(m => ({
      'Fecha':         this.formatFecha(m.fecha_entrada),
      'Muestra':       m.muestra,
      'Espectrometro': m.espectrometro,
      'Sonda':         m.sonda,
      'Estado':        m.completo ? 'Completado' : 'Pendiente'
    }));
    exportarCSV(datos, `registros_${nombre.toLowerCase().replace(/\s+/g, '_')}`);
  }
}
