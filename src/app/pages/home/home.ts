import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  imports: [ToastModule],
  providers: [MessageService],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const navigation = this.route.queryParams.subscribe((params) => {
      if (params['logout'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Logout',
          detail: 'You have logged out successfully!',
          life: 3000,
        });
      }
      if (params['login'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Login',
          detail: 'You have logged in successfully!',
          life: 3000,
        });
      }
    });
  }
}
