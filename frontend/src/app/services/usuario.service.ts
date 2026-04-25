import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../ApiGestionFront/class/usuario';
;

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  private readonly apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

 listar(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(this.apiUrl);
}

getUsuarioConMuestras(id: string): Observable<any> {
    // Esto llamará a http://localhost:3000/api/usuarios/ID_DEL_USUARIO/muestras
    return this.http.get<any>(`${this.apiUrl}/${id}/muestras`);
  }
}