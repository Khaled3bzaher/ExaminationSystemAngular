import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = this.auth.getToken();

    if (!token) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }
    if (this.auth.isTokenExpired()) {
      this.auth.logout();
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: true },
      });
      return false;
    }
    const expectedRole = route.data['expectedRole'];
    const userRole = this.auth.getRole();

    if (expectedRole && userRole !== expectedRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
