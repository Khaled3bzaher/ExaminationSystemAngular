import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { Popover } from 'primeng/popover';
import { NotificationsHistory } from '../notifications-history/notifications-history';
import { OverlayBadgeModule } from 'primeng/overlaybadge';



@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,Popover,NotificationsHistory,OverlayBadgeModule  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  notificationCount = 0;
  onNotificationCountChanged(count: number) {
  this.notificationCount = count;
}

  menuOpen = false;
  private authService = inject(Auth);
  isAuthenticated :Boolean = false;
  isAdmin: Boolean = false;
  userName: string = '';
  constructor() {
    this.authService.isAuthenticatedSubject.subscribe((res)=>{
      this.isAdmin=this.authService.isAdmin()
      this.isAuthenticated=this.authService.isAuthenticatedSubject.getValue()
      this.userName = this.authService.getUserName();
    }
    )
  }

OnLogout(){
  this.authService.logout();
}
  toggleMobileMenu() {
    this.menuOpen = !this.menuOpen;
}

  
}
