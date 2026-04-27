import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login'; // Ajusta la URL si es necesario

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(user => {
        // Guardamos los datos del usuario (y su rol) en el navegador
        localStorage.setItem('usuarioLogeado', JSON.stringify(user));
      })
    );
  }

  getUsuarioActual() {
    const userStr = localStorage.getItem('usuarioLogeado');
    return userStr ? JSON.parse(userStr) : null;
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogeado');
  }
}