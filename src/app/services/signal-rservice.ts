import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MessageService } from 'primeng/api';
import { ExamEvaluatedResponse } from '../Interfaces/ExamEvaluatedResponse';
import { environment } from '../../environment';
import { Auth } from './auth/auth';
import { StartExamNotificationDTO } from '../Interfaces/StartExamNotificationDTO';
import { NotificationsService } from './notifications-service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private authService = inject(Auth);
  private notificationService = inject(NotificationsService);
  constructor(private messageService: MessageService) {}

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalRHubUrl}`, {
        accessTokenFactory: () => this.authService.getToken() || '',
      })
      .withAutomaticReconnect()
      .build();

    return this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.registerListeners();
      })
      .catch((err) => {
        console.error('Error while starting connection: ' + err);
        return Promise.reject(err);
      });
  }

  private registerListeners(): void {
    this.hubConnection.on(
      'ReceiveExamScore',
      (result: ExamEvaluatedResponse) => {
        this.showStudentExamResult(result);

      }
    );
    this.hubConnection.on(
      'NewExamResultAvailable',
      (result: ExamEvaluatedResponse) => {
        this.showAdminExamResult(result);
      }
    );
    this.hubConnection.on(
      'StudentStartedExam',
      (data: StartExamNotificationDTO) => {
        
        this.messageService.add({
          severity: 'info',
          summary: 'Student Started Exam',
          detail: `${data.studentName} started "${
            data.subjectName
          }"`,
        });
      }
    );
  }
  private showStudentExamResult(result: ExamEvaluatedResponse): void {
    this.notificationService.notifyNewNotification.next(true);
    this.messageService.add({
      severity: result.examStatus === '1' ? 'error' : 'success',
      summary: 'Exam Result',
      detail: `You have received a new exam result for ${result.subjectName}. Score: ${result.score}/${result.totalQuestions}.`,
    });
  }
  private showAdminExamResult(result: ExamEvaluatedResponse): void {
    this.notificationService.notifyNewNotification.next(true);
    this.messageService.add({
      severity: 'info',
      summary: 'New Exam Result Available',
      detail: `New exam result for ${result.studentName} in ${result.subjectName}. Score: ${result.score}/${result.totalQuestions}.`,
    });
  }
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((err) => console.error(err));
    }
  }
  
}
