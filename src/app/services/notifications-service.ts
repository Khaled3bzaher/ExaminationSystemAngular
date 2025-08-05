import { HttpClient, HttpParams } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { ApiResponse } from '../Interfaces/APIResponse';
import { PaginatedResponse } from '../Interfaces/PaginatedResponse';
import { BehaviorSubject } from 'rxjs';
import { NotificationResponse } from '../Interfaces/NotificationResponse';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notifyNewNotification = new BehaviorSubject<boolean>(false);
 constructor(private httpClient: HttpClient) {
    
  }
  getAllNotifications(params : HttpParams){
    return this.httpClient.get<ApiResponse<PaginatedResponse<NotificationResponse>>>('Notifications', { params });
  }
  
  markNotificationAsRead(notificationId:string){
    return this.httpClient.put<ApiResponse<string>>(`Notifications/${notificationId}`,null);
  }
}
