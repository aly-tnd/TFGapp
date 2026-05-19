import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EdicionService } from '../../../services/edicion.service';

@Component({
  selector: 'app-ver-ediciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './ver-ediciones.component.html',
  styleUrls: ['./ver-ediciones.component.scss']
})
export class VerEdicionesComponent implements OnInit {
  registro: any = null;
  registroId = '';
  ediciones: any[] = [];
  edicionSeleccionada: any = null;
  ordenDesc = true;

  readonly tamanosPagina = [5, 10, 20, 50, 100];
  pagina       = 1;
  tamanoPagina = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private edicionService: EdicionService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.registro = nav?.extras?.state?.['registro'] ?? null;
  }

  ngOnInit() {
    this.registroId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.registroId) {
      this.edicionService.getByRegistroId(this.registroId).subscribe({
        next: (data) => this.ediciones = data,
        error: (err)  => console.error('Error cargando ediciones:', err)
      });
    }
  }

  get edicionesOrdenadas(): any[] {
    return [...this.ediciones].sort((a, b) => {
      const da = new Date(a.fecha_edicion).getTime();
      const db = new Date(b.fecha_edicion).getTime();
      return this.ordenDesc ? db - da : da - db;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.edicionesOrdenadas.length / this.tamanoPagina) || 1;
  }

  get edicionesPagina(): any[] {
    const inicio = (this.pagina - 1) * this.tamanoPagina;
    return this.edicionesOrdenadas.slice(inicio, inicio + this.tamanoPagina);
  }

  get rangoInicio(): number {
    return this.edicionesOrdenadas.length === 0 ? 0 : (this.pagina - 1) * this.tamanoPagina + 1;
  }

  get rangoFin(): number {
    return Math.min(this.pagina * this.tamanoPagina, this.edicionesOrdenadas.length);
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

  toggleOrden() {
    this.ordenDesc = !this.ordenDesc;
    this.pagina = 1;
  }

  formatFechaCompleta(fechaStr: string | Date): string {
    if (!fechaStr) return '-';
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(fechaStr));
  }

  abrirModal(edicion: any) {
    this.edicionSeleccionada = edicion;
  }

  cerrarModal() {
    this.edicionSeleccionada = null;
  }

  // Genera y abre una ventana con el contenido de la edicion en formato imprimible
  exportarPDF(edicion: any) {
    const r = this.registro;
    const resuelve = (val: string | undefined, otro: string | undefined) =>
      val === 'Otro' ? (otro || 'Otro') : (val || '—');

    const filas: [string, string][] = [
      ['Fecha de edicion',          this.formatFechaCompleta(edicion.fecha_edicion)],
      ['Secuencia',                 resuelve(edicion.secuencia, edicion.secuencia_otro)],
      ['Solvente',                  resuelve(edicion.solvente, edicion.solvente_otro)],
      ['Concentracion estimada',    edicion.concentracion_estimada   || '—'],
      ['Estado de la muestra',      edicion.estado_muestra           || '—'],
      ['Proposito del experimento', resuelve(edicion.proposito, edicion.proposito_otro)],
      ['Incidencias / calidad',     (edicion.incidencias?.join(', ') || 'Ninguna') + (edicion.incidencias_otro ? ` (${edicion.incidencias_otro})` : '')],
      ['Descripcion incidencias',   edicion.descripcion_incidencias  || '—'],
      ['Se repitio la adquisicion', edicion.repetida_adquisicion     || '—'],
      ['Observaciones generales',   edicion.observaciones            || '—']
    ];

    const html = `<!DOCTYPE html><html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Edicion ${this.formatFechaCompleta(edicion.fecha_edicion)}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 13px; color: #333; padding: 30px; max-width: 700px; margin: 0 auto; }
    h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 6px; }
    .meta { display: flex; gap: 24px; margin-bottom: 20px; font-size: 12px; color: #607d8b; }
    .meta span strong { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { background: #2c3e50; color: white; padding: 8px 12px; text-align: left; font-size: 12px; }
    td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; vertical-align: top; }
    td:first-child { font-weight: 600; color: #444; width: 200px; white-space: nowrap; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .footer { margin-top: 24px; font-size: 11px; color: #999; text-align: right; }
  </style>
</head>
<body>
  <h2>Registro de Edicion</h2>
  <div class="meta">
    <span><strong>Muestra:</strong> ${r?.muestra || '—'}</span>
    <span><strong>Espectrometro:</strong> ${r?.espectrometro || '—'}</span>
    <span><strong>Sonda:</strong> ${r?.sonda || '—'}</span>
  </div>
  <table>
    <thead><tr><th>Campo</th><th>Valor</th></tr></thead>
    <tbody>
      ${filas.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="footer">Generado el ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</div>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 350);
    }
  }

  valorMostrado(val: string | undefined, otro: string | undefined): string {
    if (!val) return '—';
    return val === 'Otro' ? (otro || 'Otro') : val;
  }
}
