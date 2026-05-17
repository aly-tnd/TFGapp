import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistroService } from '../../../services/registro.service';
import { exportarCSV } from '../../../shared/utils/csv-export.util';

@Component({
  selector: 'app-mis-registros',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './mis-registros.component.html',
  styleUrls: ['./mis-registros.component.scss']
})
export class MisRegistrosComponent implements OnInit {
  registros: any[] = [];
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
  pagina      = 1;
  tamanoPagina = 5;

  constructor(private registroService: RegistroService) {}

  ngOnInit() {
    this.registroService.getMisRegistros().subscribe({
      next: (data) => this.registros = data,
      error: (err)  => console.error('Error cargando registros:', err)
    });
  }

  get espectrometrosDisponibles(): string[] {
    return [...new Set(this.registros.map(r => r.espectrometro).filter(Boolean))];
  }

  // Sondas filtradas al espectrometro seleccionado en el filtro
  get sondasDisponibles(): string[] {
    const base = this.filtros.espectrometro
      ? this.registros.filter(r => r.espectrometro === this.filtros.espectrometro)
      : this.registros;
    return [...new Set(base.map(r => r.sonda).filter(Boolean))];
  }

  get registrosFiltrados(): any[] {
    return this.registros.filter(r => {
      if (this.filtros.muestra &&
          !r.muestra?.toLowerCase().includes(this.filtros.muestra.toLowerCase())) return false;
      if (this.filtros.espectrometro && r.espectrometro !== this.filtros.espectrometro) return false;
      if (this.filtros.sonda && r.sonda !== this.filtros.sonda) return false;
      if (this.filtros.estado !== '') {
        if (r.completo !== (this.filtros.estado === 'true')) return false;
      }
      if (this.filtros.fechaDesde) {
        const desde = new Date(this.filtros.fechaDesde);
        if (new Date(r.fecha_entrada) < desde) return false;
      }
      if (this.filtros.fechaHasta) {
        const hasta = new Date(this.filtros.fechaHasta);
        hasta.setHours(23, 59, 59);
        if (new Date(r.fecha_entrada) > hasta) return false;
      }
      return true;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.registrosFiltrados.length / this.tamanoPagina) || 1;
  }

  get registrosPagina(): any[] {
    const inicio = (this.pagina - 1) * this.tamanoPagina;
    return this.registrosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get rangoInicio(): number {
    return this.registrosFiltrados.length === 0 ? 0 : (this.pagina - 1) * this.tamanoPagina + 1;
  }

  get rangoFin(): number {
    return Math.min(this.pagina * this.tamanoPagina, this.registrosFiltrados.length);
  }

  get paginasVisibles(): number[] {
    const total   = this.totalPaginas;
    const current = this.pagina;
    const pages: number[] = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  cambiarPagina(n: number) {
    this.pagina = Math.max(1, Math.min(n, this.totalPaginas));
  }

  cambiarTamano(tamano: number) {
    this.tamanoPagina = Number(tamano);
    this.pagina = 1;
  }

  aplicarFiltro() {
    this.pagina = 1;
  }

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

  // Exporta todos los registros del usuario, sin respetar filtros ni paginacion
  exportarTodo() {
    const datos = this.registros.map(r => ({
      'Fecha':         this.formatFecha(r.fecha_entrada),
      'Muestra':       r.muestra,
      'Espectrometro': r.espectrometro,
      'Sonda':         r.sonda,
      'Estado':        r.completo ? 'Completado' : 'Pendiente'
    }));
    exportarCSV(datos, 'mis_registros');
  }
}
