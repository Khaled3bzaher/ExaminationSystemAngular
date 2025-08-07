import { Component, inject } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { PreviewExamResponse } from '../../Interfaces/PreviewExamResponse';
import { ExamService } from '../../services/ExamService';
import { MessageService } from 'primeng/api';
import { PreviewExamQuestion } from "../../components/exams/preview-exam-question/preview-exam-question";
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-preview-exam',
  imports: [ProgressSpinner, PreviewExamQuestion,Button,DatePipe],
  templateUrl: './preview-exam.html',
  styleUrl: './preview-exam.css',
})
export class PreviewExam {
  isLoading = true;
  constructor(private authService: Auth, private router: Router,private messageService: MessageService) {
    this.authService.isAuthenticatedSubject.subscribe((res) => {
      if (!this.authService.isAuthenticatedSubject.getValue()) {
        this.router.navigate(['/login']);
      }
    });
  }
  private examService = inject(ExamService);
  exam!: PreviewExamResponse;
  ngOnInit() {
    const examId = this.router.url.split('/').pop();
    if (examId) {
      this.LoadExam(examId);
    } else {
      this.router.navigate(['/exams']);
    }
  }
  LoadExam(id: string) {
    this.examService.examPreview(id).subscribe({
      next: (res) => {
        this.exam = res.data!;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
  goToPage(index: number) {
    this.currentPage = index;
  }

  currentPage = 0;

  isAnswered(questionId: string): boolean {
    return this.exam.questions.some(q => q.id === questionId && q.selectedChoiceId !== null);
  }
}
