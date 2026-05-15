import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { GestionUsuariosService } from '../../../services/usuario.service';
import { RegistroService } from '../../../services/registro.service';
import { EspectrometroService } from '../../../services/espectrometro.service';
import { GraficoEspectrometroComponent } from '../grafico-espectrometro/grafico-espectrometro.component';

@Component({
  selector: 'app-crear-registro',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule,
    GraficoEspectrometroComponent
  ],
  templateUrl: './crear-registro.component.html',
  styleUrls: ['./crear-registro.component.scss']
})
export class CrearRegistroComponent implements OnInit {

  public espectrometros: { id: string; nombre: string; sondas: string[] }[] = [];
  public sondasDisponibles: string[] = [];
  public espectrometroSeleccionado: { id: string; nombre: string; sondas: string[] } | null = null;

  public registro = {
    espectrometro: '',
    espectrometro_id: '',
    sonda: '',
    fechaEntrada: '',
    usuario: '',
    nombreMuestra: '',
    idSolicitud: '',
    finalizado: false,
    recuperarMuestra: false
  };

  public listaUsuarios: any[] = [];

  constructor(
    private usuarioService: GestionUsuariosService,
    private registroService: RegistroService,
    private espectrometroService: EspectrometroService
  ) {}

  ngOnInit() {
    this.usuarioService.listar().subscribe({
      next: (users) => this.listaUsuarios = users,
      error: (err) => console.error('Error cargando usuarios', err)
    });

    this.espectrometroService.listar().subscribe({
      next: (data) => this.espectrometros = data,
      error: (err) => console.error('Error cargando espectrometros', err)
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
    const payload = {
      espectrometro:    this.registro.espectrometro,
      espectrometro_id: this.registro.espectrometro_id || undefined,
      sonda:            this.registro.sonda,
      usuario_id:       this.registro.usuario,
      fecha_entrada:    this.registro.fechaEntrada,
      muestra:          this.registro.nombreMuestra,
      completo:         this.registro.finalizado
    };

    this.registroService.crear(payload).subscribe({
      next: () => alert('Muestra guardada con éxito'),
      error: (err: any) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar la muestra');
      }
    });
  }
}
