import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NotificationResponse } from '../../Interfaces/NotificationResponse';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { NotificationsService } from '../../services/notifications-service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-notifications-history',
  imports: [TableModule,DatePipe,Button,ProgressSpinner,Paginator],
  templateUrl: './notifications-history.html',
  styleUrl: './notifications-history.css'
})
export class NotificationsHistory {
  notificationsHistory = signal<NotificationResponse[]>([]);
  selectedNotification: NotificationResponse | null = null;
  private notificationsService = inject(NotificationsService);
  private messageService = inject(MessageService);
  isAdmin = false;
  private authService = inject(Auth);
    isLoading = true;
  pageSize = 5;
  studentId='';
  search = '';
  pageIndex = 0;
  totalCount = signal(0);
  @Output() notificationCount = new EventEmitter<number>();
  ngOnInit(){
    this.authService.isAuthenticatedSubject.subscribe((res) => {
      this.isAdmin = this.authService.isAdmin();
    });
    this.LoadNotifications();
    this.notificationsService.notifyNewNotification.subscribe((newNotification) => {
      if (newNotification) {
        this.isLoading = true;
        this.LoadNotifications();
      }
    });
  }
  LoadNotifications(){
    let params = new HttpParams()
      .set('pageSize', this.pageSize)
      .set('pageIndex', this.pageIndex + 1) // Adjusting for 0-based index
      .set('search', this.search)
      .set('studentId', this.studentId);

      if (this.isAdmin) {
    params = params.set('ForAdmin', true);
  }

    this.notificationsService.getAllNotifications(params).subscribe({
      next: (res) => {
        this.notificationsHistory.set(res.data!.data);
        this.totalCount.set(res.data!.totalCount);
        this.notificationCount.emit(res.data!.totalCount);
        this.isLoading = false;
      },
      error: (err) => {
        if (!err.error.data) {
          this.notificationsHistory.set([]);
          this.totalCount.set(0);
                  this.notificationCount.emit(0);

          this.isLoading = false;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
  markAsRead(notificationId: string) {
    this.notificationsService.markNotificationAsRead(notificationId).subscribe({
      next:res=>{
        this.messageService.add({
          severity: 'info',
          summary: 'Notification Read',
          detail: res.message!,
        });
        this.LoadNotifications();
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      }
    })
  }
  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.LoadNotifications();
  }
}
