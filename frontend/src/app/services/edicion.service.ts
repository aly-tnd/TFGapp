import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EdicionService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  crear(edicion: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ediciones`, edicion);
  }

  getByRegistroId(registroId: string): Observable<any[]> {
    return this.http
      .get<{ message: string; data: any[] }>(`${this.baseUrl}/ediciones/${registroId}`)
      .pipe(map(r => r.data));
  }
}
