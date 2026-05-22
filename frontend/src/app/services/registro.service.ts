import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly baseUrl = 'https://tfgapp.onrender.com/api';

  constructor(private http: HttpClient) {}

  /** Registros del usuario autenticado */
  getMisRegistros(): Observable<any[]> {
    return this.http
      .get<{ message: string; data: any[] }>(`${this.baseUrl}/mis-registros`)
      .pipe(map(r => r.data));
  }

  /** Crear un nuevo registro de muestra */
  crear(registro: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registros`, registro);
  }

  /** Todos los registros (admin) */
  listar(): Observable<any[]> {
    return this.http
      .get<{ message: string; data: any[] }>(`${this.baseUrl}/registros`)
      .pipe(map(r => r.data));
  }
}
