import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../ApiGestionFront/class/usuario';

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  private readonly apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  listar(): Observable<any[]> {
    return this.http.get<{ message: string; data: any[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

getUsuarioConMuestras(id: string): Observable<any> {
    // Esto llamará a http://localhost:3000/api/usuarios/ID_DEL_USUARIO/muestras
    return this.http.get<any>(`${this.apiUrl}/${id}/muestras`);
  }

  borrarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}