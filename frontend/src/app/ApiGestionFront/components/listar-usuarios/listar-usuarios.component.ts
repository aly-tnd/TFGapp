import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../class/usuario';
import { GestionUsuariosService } from '../../../services/usuario.service';


@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {
  // 1. Definimos el array vacío
  public usuarios: Usuario[] = [];

  // 2. Inyectamos el servicio
  constructor(private usuarioService: GestionUsuariosService) {}

  // 3. Al iniciar el componente, pedimos los datos
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios recibidos:', data);
      },
      error: (err) => {
        console.error('Error al traer usuarios:', err);
      }
    });
  }
}