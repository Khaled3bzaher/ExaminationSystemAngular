import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthPagesGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.auth.getToken() && !this.auth.isTokenExpired()) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

}
