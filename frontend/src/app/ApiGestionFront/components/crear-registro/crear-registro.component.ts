import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { RegistroService } from '../../../services/registro.service';
import { EspectrometroService } from '../../../services/espectrometro.service';
import { GraficoEspectrometroComponent } from '../grafico-espectrometro/grafico-espectrometro.component';

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
    MatCheckboxModule, MatButtonModule,
    GraficoEspectrometroComponent
  ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss']
})
export class CrearRegistroComponent implements OnInit {

  public espectrometros: { id: string; nombre: string; sondas: string[] }[] = [];
  public sondasDisponibles: string[] = [];
  public espectrometroSeleccionado: { id: string; nombre: string; sondas: string[] } | null = null;

  /** Registros del usuario cargados al inicio; se pasan al grafico y a la tabla */
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
}
