import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { EdicionService } from '../../../services/edicion.service';

function fechaMadridHoy(): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(new Date());
}

@Component({
  selector: 'app-editar-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './editar-registro.component.html',
  styleUrls: ['./editar-registro.component.scss']
})
export class EditarRegistroComponent implements OnInit {
  registro: any = null;
  registroId = '';
  nombreUsuario = '';
  fechaHoy = fechaMadridHoy();

  mensajeExito = '';
  mensajeError = '';

  readonly opcionesSecuencia  = ['zg30', 'zg', 'hsqcetgp', 'hmbcetgpl2nd', 'cosy', 'noesy', 'dept135', 'Otro'];
  readonly opcionesSolvente   = ['CDCl3', 'D2O', 'DMSO-d6', 'Acetona-d6', 'Metanol-d4', 'Otro'];
  readonly opcionesEstado     = ['Disolucion clara', 'Turbia', 'Con precipitado', 'Mezcla cruda', 'Purificada', 'Degradada / sospecha'];
  readonly opcionesProposito  = ['Identificacion', 'Control de pureza', 'Seguimiento de reaccion', 'Cuantificacion', 'Validacion de estructura', 'Otro'];
  readonly opcionesIncidencias = ['Lock inestable', 'Shim deficiente', 'Ruido electrico', 'Saturacion', 'Pico fantasma', 'Muestra precipitada', 'Problemas de temperatura', 'Ninguna', 'Otro'];
  readonly opcionesRepeticion = ['Si', 'No', 'Si, pero se descarto la primera'];

  form = {
    secuencia:               '',
    secuencia_otro:          '',
    solvente:                '',
    solvente_otro:           '',
    concentracion_estimada:  '',
    estado_muestra:          '',
    proposito:               '',
    proposito_otro:          '',
    incidencias:             [] as string[],
    incidencias_otro:        '',
    descripcion_incidencias: '',
    repetida_adquisicion:    '',
    observaciones:           ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private edicionService: EdicionService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.registro = nav?.extras?.state?.['registro'] ?? null;
  }

  ngOnInit() {
    this.registroId = this.route.snapshot.paramMap.get('id') ?? '';
    const usuario = this.authService.getUsuarioActual();
    this.nombreUsuario = usuario?.nombre || usuario?.username || '';
  }

  tieneIncidencia(opcion: string): boolean {
    return this.form.incidencias.includes(opcion);
  }

  toggleIncidencia(opcion: string) {
    const idx = this.form.incidencias.indexOf(opcion);
    if (idx >= 0) {
      this.form.incidencias.splice(idx, 1);
    } else {
      this.form.incidencias.push(opcion);
    }
  }

  guardar() {
    this.mensajeExito = '';
    this.mensajeError = '';

    const payload = {
      registro_id:             this.registroId,
      secuencia:               this.form.secuencia,
      secuencia_otro:          this.form.secuencia === 'Otro' ? this.form.secuencia_otro : undefined,
      solvente:                this.form.solvente,
      solvente_otro:           this.form.solvente === 'Otro' ? this.form.solvente_otro : undefined,
      concentracion_estimada:  this.form.concentracion_estimada || undefined,
      estado_muestra:          this.form.estado_muestra || undefined,
      proposito:               this.form.proposito,
      proposito_otro:          this.form.proposito === 'Otro' ? this.form.proposito_otro : undefined,
      incidencias:             this.form.incidencias,
      incidencias_otro:        this.tieneIncidencia('Otro') ? this.form.incidencias_otro : undefined,
      descripcion_incidencias: this.form.descripcion_incidencias || undefined,
      repetida_adquisicion:    this.form.repetida_adquisicion || undefined,
      observaciones:           this.form.observaciones || undefined
    };

    this.edicionService.crear(payload).subscribe({
      next: () => {
        this.mensajeExito = 'Edicion guardada correctamente.';
        setTimeout(() => this.mensajeExito = '', 4000);
      },
      error: (err) => {
        console.error('Error al guardar edicion:', err);
        this.mensajeError = 'Error al guardar la edicion. Intentalo de nuevo.';
      }
    });
  }

  limpiar() {
    if (!confirm('¿Seguro que quieres limpiar el formulario? Se perderan los datos no guardados.')) return;
    this.form = {
      secuencia: '', secuencia_otro: '', solvente: '', solvente_otro: '',
      concentracion_estimada: '', estado_muestra: '', proposito: '', proposito_otro: '',
      incidencias: [], incidencias_otro: '', descripcion_incidencias: '',
      repetida_adquisicion: '', observaciones: ''
    };
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}
