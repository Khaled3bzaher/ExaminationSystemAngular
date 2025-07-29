import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { type ApiResponse } from '../../Interfaces/APIResponse';
import { type AuthResponse } from '../../Interfaces/AuthResponse';
import { type LoginRequest } from '../../Interfaces/LoginRequest';
import { RegisterRequest } from '../../Interfaces/RegisterRequest';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private router = inject(Router);

  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated(): Observable<boolean> {
  return this.isAuthenticatedSubject.asObservable();
}

  constructor(private httpClient: HttpClient) {
    if (this.getToken()) {
      this.isAuthenticatedSubject.next(true);
    }
  }
  
  loginRequest(loginData: LoginRequest) {
    return this.httpClient.post<ApiResponse<AuthResponse>>(
      `Authentication/Login`,
      loginData
    )
  }
  registerRequest(registerData : RegisterRequest){
    return this.httpClient.post<ApiResponse<AuthResponse>>(
      `Authentication/Register`,
      registerData
    )
  }
  logout(){
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/home'], { queryParams: { logout: 'true' } });
  }
  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }
  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  }
  private readonly studentIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
  private readonly roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  getId(): string | null {
    const payload = this.getTokenPayload();
    return payload?.[this.studentIdClaim] ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRole(): string | null {
  const payload = this.getTokenPayload();
  return payload?.[this.roleClaim] ?? null;
}
isAdmin(): boolean {
  return this.getRole() === 'Admin';
}
isTokenExpired(): boolean {
  const payload = this.getTokenPayload();
  if (!payload || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}
}
