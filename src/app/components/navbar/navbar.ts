import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { Sider } from "../shared/sider/sider";


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Sider],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  menuOpen = false;
  private authService = inject(Auth);
  isAuthenticated :Boolean = false;
  isAdmin: Boolean = false;
  constructor() {
    this.authService.isAuthenticatedSubject.subscribe((res)=>{
      this.isAdmin=this.authService.isAdmin()
      this.isAuthenticated=this.authService.isAuthenticatedSubject.getValue()
    }
    )
  }

OnLogout(){
  this.authService.logout();
}
  toggleMobileMenu() {
    this.menuOpen = !this.menuOpen;
}
 isSiderVisible = false;

  toggleSider() {
    this.isSiderVisible = !this.isSiderVisible;
  }
}
