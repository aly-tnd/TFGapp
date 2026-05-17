import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GestionUsuariosService } from '../../../services/usuario.service';
import { exportarCSV } from '../../../shared/utils/csv-export.util';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filtroVisible = false;

  filtros = { nombre: '', email: '' };

  readonly tamanosPagina = [5, 10, 20, 50, 100];
  pagina       = 1;
  tamanoPagina = 5;

  constructor(private usuarioService: GestionUsuariosService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (data) => this.usuarios = data.filter((u: any) => u.rol !== 'admin'),
      error: (err)  => console.error('Error al cargar usuarios:', err)
    });
  }

  get usuariosFiltrados(): any[] {
    return this.usuarios.filter(u => {
      if (this.filtros.nombre &&
          !u.nombre?.toLowerCase().includes(this.filtros.nombre.toLowerCase())) return false;
      if (this.filtros.email &&
          !u.email?.toLowerCase().includes(this.filtros.email.toLowerCase())) return false;
      return true;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.tamanoPagina) || 1;
  }

  get usuariosPagina(): any[] {
    const inicio = (this.pagina - 1) * this.tamanoPagina;
    return this.usuariosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get rangoInicio(): number {
    return this.usuariosFiltrados.length === 0 ? 0 : (this.pagina - 1) * this.tamanoPagina + 1;
  }

  get rangoFin(): number {
    return Math.min(this.pagina * this.tamanoPagina, this.usuariosFiltrados.length);
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
    this.filtros = { nombre: '', email: '' };
    this.pagina = 1;
  }

  borrarUsuario(usuario: any) {
    const id = usuario.id || usuario._id;
    if (confirm(`¿Seguro que quieres borrar a ${usuario.nombre}?`)) {
      this.usuarioService.borrarUsuario(id).subscribe({
        next: () => { alert('Usuario borrado correctamente'); this.cargarUsuarios(); },
        error: (err) => { console.error('Error al borrar:', err); alert('Error al borrar el usuario'); }
      });
    }
  }

  // Exporta la lista de usuarios visible (filtrada), sin paginacion
  exportarUsuarios() {
    const datos = this.usuariosFiltrados.map(u => ({
      'Nombre': u.nombre,
      'Email':  u.email
    }));
    exportarCSV(datos, 'listado_usuarios');
  }
}
