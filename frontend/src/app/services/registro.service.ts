import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  // Ajusta esta URL según tu configuración de backend en Docker
  private apiUrl = 'http://localhost:3000/api/registros'; 

  constructor(private http: HttpClient) {}

  /**
   * Guarda un nuevo registro de muestra en la base de datos
   */
  crear(registro: any): Observable<any> {
    return this.http.post(this.apiUrl, registro);
  }

  /**
   * Obtiene todos los registros (útil para la tabla de "Listar Muestras")
   */
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Actualiza un registro existente (ej: marcar como finalizado)
   */
  actualizar(id: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }
}