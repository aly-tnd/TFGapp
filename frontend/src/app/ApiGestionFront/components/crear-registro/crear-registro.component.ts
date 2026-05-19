import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { RegistroService } from '../../../services/registro.service';
import { EspectrometroService } from '../../../services/espectrometro.service';
import { GraficoEspectrometroComponent } from '../grafico-espectrometro/grafico-espectrometro.component';

const SEP = ';';

/** Devuelve la fecha actual en formato YYYY-MM-DD con zona horaria de Madrid */
function fechaMadridHoy(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
}

@Component({
  selector: 'app-crear-registro',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, MatButtonModule, MatIconModule,
    GraficoEspectrometroComponent
  ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss']
})
export class CrearRegistroComponent implements OnInit {

  public espectrometros: { id: string; nombre: string; sondas: string[] }[] = [];
  public sondasDisponibles: string[] = [];
  public espectrometroSeleccionado: { id: string; nombre: string; sondas: string[] } | null = null;

  /** Registros del usuario cargados al inicio; se pasan al grafico */
  public misRegistros: any[] = [];

  public registro = {
    espectrometro:    '',
    espectrometro_id: '',
    sonda:            '',
    fechaEntrada:     fechaMadridHoy(),
    nombreMuestra:    '',
    finalizado:       false,
    recuperarMuestra: false
  };

  // Estado del modal de importacion
  modalImportarVisible = false;
  importando           = false;
  resultadoImport      = '';
  hayErroresImport     = false;

  @ViewChild('inputCSV') inputCSV!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private registroService: RegistroService,
    private espectrometroService: EspectrometroService
  ) {}

  ngOnInit() {
    this.espectrometroService.listar().subscribe({
      next: (data) => this.espectrometros = data,
      error: (err) => console.error('Error cargando espectrometros:', err)
    });
    this.cargarMisRegistros();
  }

  cargarMisRegistros() {
    this.registroService.getMisRegistros().subscribe({
      next: (data) => this.misRegistros = data,
      error: (err) => console.error('Error cargando registros:', err)
    });
  }

  actualizarSondas() {
    const esp = this.espectrometros.find(e => e.id === this.registro.espectrometro_id);
    this.espectrometroSeleccionado = esp ?? null;
    this.sondasDisponibles = esp?.sondas ?? [];
    this.registro.espectrometro = esp?.nombre ?? '';
    this.registro.sonda = '';
  }

  guardarMuestra() {
    const usuarioActual = this.authService.getUsuarioActual();
    if (!usuarioActual) return;

    const payload = {
      espectrometro:    this.registro.espectrometro,
      espectrometro_id: this.registro.espectrometro_id || undefined,
      sonda:            this.registro.sonda,
      usuario_id:       usuarioActual.id,
      fecha_entrada:    this.registro.fechaEntrada,
      muestra:          this.registro.nombreMuestra,
      completo:         this.registro.finalizado
    };

    this.registroService.crear(payload).subscribe({
      next: () => {
        alert('Muestra guardada correctamente');
        this.registro.nombreMuestra = '';
        this.registro.sonda = '';
        this.registro.finalizado = false;
        this.registro.recuperarMuestra = false;
        this.registro.fechaEntrada = fechaMadridHoy();
        this.cargarMisRegistros();
      },
      error: (err: any) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar la muestra');
      }
    });
  }

  // ── Modal de importacion ─────────────────────────────────────────────────

  abrirModalImportar() {
    this.resultadoImport  = '';
    this.hayErroresImport = false;
    this.importando       = false;
    this.modalImportarVisible = true;
  }

  cerrarModalImportar() {
    if (this.importando) return;
    this.modalImportarVisible = false;
  }

  /** Descarga una plantilla CSV con cabeceras y dos filas de ejemplo */
  descargarPlantilla() {
    const hoy = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date());

    const lineas = [
      ['Fecha', 'Muestra', 'Espectrometro', 'Sonda', 'Estado'].join(SEP),
      [hoy, 'Muestra001', 'Bruker 400MHz', 'BBO 400S1 H-D-BB-Z', 'Pendiente'].join(SEP),
      [hoy, 'Muestra002', 'Bruker 600MHz', 'TCI-600', 'Completado'].join(SEP)
    ];

    const csv  = '﻿' + lineas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = 'plantilla_muestras.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  /** Lanza el selector de archivo */
  seleccionarArchivo() {
    this.inputCSV.nativeElement.value = '';
    this.inputCSV.nativeElement.click();
  }

  /** Lee el archivo CSV seleccionado e importa las filas */
  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const usuarioActual = this.authService.getUsuarioActual();
    if (!usuarioActual) return;

    const texto = await file.text();
    const filas = this.parsearCSV(texto);

    if (!filas.length) {
      this.resultadoImport  = 'El archivo no contiene filas validas.';
      this.hayErroresImport = true;
      return;
    }

    this.importando      = true;
    this.resultadoImport = `Importando 0 de ${filas.length}...`;
    this.hayErroresImport = false;

    let exitosos = 0;
    let errores  = 0;

    for (const fila of filas) {
      const fechaISO = this.parsearFecha(fila['Fecha'] ?? '');
      const esp      = this.espectrometros.find(
        e => e.nombre.toLowerCase() === (fila['Espectrometro'] ?? '').trim().toLowerCase()
      );

      const payload = {
        muestra:          (fila['Muestra'] ?? '').trim(),
        espectrometro:    (fila['Espectrometro'] ?? '').trim(),
        espectrometro_id: esp?.id,
        sonda:            (fila['Sonda'] ?? '').trim(),
        usuario_id:       usuarioActual.id,
        fecha_entrada:    fechaISO,
        completo:         (fila['Estado'] ?? '').trim().toLowerCase() === 'completado'
      };

      if (!payload.muestra || !payload.espectrometro || !payload.sonda) {
        errores++;
      } else {
        try {
          await firstValueFrom(this.registroService.crear(payload));
          exitosos++;
        } catch {
          errores++;
        }
      }

      this.resultadoImport = `Importando ${exitosos + errores} de ${filas.length}...`;
    }

    this.importando = false;
    const ok  = `${exitosos} muestra${exitosos !== 1 ? 's' : ''} importada${exitosos !== 1 ? 's' : ''} correctamente`;
    const err = errores > 0 ? `. ${errores} fila${errores !== 1 ? 's' : ''} con error (campos vacios o invalidos).` : '.';
    this.resultadoImport  = ok + err;
    this.hayErroresImport = errores > 0;

    if (exitosos > 0) this.cargarMisRegistros();
  }

  // ── Utilidades CSV ───────────────────────────────────────────────────────

  /** Parsea texto CSV con separador ';' y valores opcionalmente entrecomillados */
  private parsearCSV(texto: string): Record<string, string>[] {
    // Eliminar BOM si existe
    const limpio = texto.replace(/^﻿/, '').trim();
    const lineas = limpio.split(/\r?\n/).filter(l => l.trim());
    if (lineas.length < 2) return [];

    const cabeceras = this.parsearFila(lineas[0]);
    return lineas.slice(1).map(l => {
      const vals = this.parsearFila(l);
      const obj: Record<string, string> = {};
      cabeceras.forEach((c, i) => obj[c.trim()] = (vals[i] ?? '').trim());
      return obj;
    });
  }

  /** Parsea una fila CSV respetando valores entre comillas */
  private parsearFila(linea: string): string[] {
    const res: string[] = [];
    let actual = '';
    let enComillas = false;

    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (c === '"') {
        if (enComillas && linea[i + 1] === '"') { actual += '"'; i++; }
        else { enComillas = !enComillas; }
      } else if (c === SEP && !enComillas) {
        res.push(actual); actual = '';
      } else {
        actual += c;
      }
    }
    res.push(actual);
    return res;
  }

  /** Convierte 'dd/MM/yyyy' a ISO string; devuelve undefined si el formato es invalido */
  private parsearFecha(fechaStr: string): string | undefined {
    const m = fechaStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return undefined;
    const fecha = new Date(`${m[3]}-${m[2]}-${m[1]}`);
    return isNaN(fecha.getTime()) ? undefined : fecha.toISOString();
  }
}
