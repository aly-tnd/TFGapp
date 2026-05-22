
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EspectrometroService {
  private apiUrl = 'https://tfgapp.onrender.com/api/espectrometros';

  constructor(private http: HttpClient) {}

  crear(datos: { nombre: string; sondas: string[] }): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

  // AÑADE ESTO PARA EL DESPLEGABLE DEL REGISTRO
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}