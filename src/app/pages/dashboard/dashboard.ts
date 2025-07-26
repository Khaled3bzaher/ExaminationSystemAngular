import { Component, inject } from '@angular/core';
import { StatsResponse } from '../../Interfaces/StatsResponse';
import { AdminService } from '../../services/admin-service';
import { Toast } from 'primeng/toast';
import { Router } from '@angular/router';
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
  constructor(private router:Router,private messageService: MessageService) {}

  stats!:StatsResponse;
  isLoading = true;
  ngOnInit(){
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
  }
}
