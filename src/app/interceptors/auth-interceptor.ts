import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(Auth);
  const token = authService.getToken();

  if (token) {
    if (authService.isTokenExpired()) {
      authService.logout();
      router.navigate(['/login'], { queryParams: { sessionExpired: true } });
      return next(req);
    }
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req).pipe(
  catchError((error) => {
    if (error.status === 401) {
      localStorage.removeItem('token');
      router.navigate(['/login']);
    }
    return throwError(() => error);
  })
  );
};
