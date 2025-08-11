import { Component, inject } from '@angular/core';
import { StatsResponse } from '../../Interfaces/StatsResponse';
import { AdminService } from '../../services/admin-service';
import { Toast } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard',
  imports: [Toast,ProgressSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private adminService = inject(AdminService);
  constructor(private router:Router,private messageService: MessageService,private route: ActivatedRoute) {}

  stats!:StatsResponse;
  isLoading = true;
  ngOnInit(){
    const navigation = this.route.queryParams.subscribe((params) => {
      
      if (params['login'] === 'true') {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Login',
            detail: 'You have logged in successfully!',
            life: 3000,
          });
        }, 100);
      }
    });
    
    this.adminService.getStats().subscribe({
      next:res=>{
        this.stats=res.data!;
        this.isLoading=false;
      },
      error:err=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
        });
      }
    })
  };

  
  
}
