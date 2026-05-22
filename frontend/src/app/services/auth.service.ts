import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface AuthUser {
  id: string;
  nombre: string;
  username?: string;
  email: string;
  rol: 'admin' | 'user';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'https://tfgapp.onrender.com/api';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      map(response => response.user),
      catchError(error => throwError(() => error))
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.currentUserSubject.next(null);
  }

  // Alias usado por MenuComponent (compatibilidad)
  cerrarSesion(): void {
    this.logout();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUsuarioActual(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.rol === role;
  }

  // Actualizar nombre de usuario visible (username)
  updateUsername(username: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/perfil`, { username }).pipe(
      tap(() => {
        const user = this.currentUserSubject.value;
        if (user) {
          const updated = { ...user, username };
          localStorage.setItem('auth_user', JSON.stringify(updated));
          this.currentUserSubject.next(updated);
        }
      })
    );
  }

  // Cambiar contraseña (verifica la contraseña actual en el backend)
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/perfil`, { currentPassword, newPassword });
  }

  // Eliminar cuenta propia (solo usuarios normales)
  deleteAccount(password: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/perfil`, { body: { password } });
  }

  private getStoredUser(): AuthUser | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }
}
