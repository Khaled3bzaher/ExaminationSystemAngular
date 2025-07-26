import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ExamInstruction } from '../../components/exams/exam-instruction/exam-instruction';
import { StudentExamResponse } from '../../Interfaces/StudentExamResponse';
import { Button } from 'primeng/button';
import { ExamQuestion } from '../../components/exams/exam-question/exam-question';
import { ExamService } from '../../services/ExamService';
import { CommonModule } from '@angular/common';
import { StudentExamDTO } from '../../Interfaces/StudentExamDTO';
import { ExamQuestionDTO } from '../../Interfaces/ExamQuestionDTO';

@Component({
  selector: 'app-student-exams',
  imports: [
    ProgressSpinner,
    Toast,
    ExamInstruction,
    Button,
    ExamQuestion,
    CommonModule,
  ],
  templateUrl: './student-exams.html',
  styleUrl: './student-exams.css',
})
export class StudentExams implements OnInit {
  constructor(private messageService: MessageService) {}

  isLoading = true;
  subjectId!: string;
  subjectName!: string;

  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private userId!: string | null;
  private examService = inject(ExamService);

  exam!: StudentExamResponse;
  examStarted = false;
  currentPage = 0;
  examSubmitted = false;
  timeLeft = '';
  timer: any;

  answers: { [questionId: string]: number } = {};
  storeAnswer(questionId: string, choiceId: number) {
    this.answers[questionId] = choiceId;
    localStorage.setItem('examAnswers', JSON.stringify(this.answers));
  }
  goToPage(index: number) {
    this.currentPage = index;
  }
  isAnswered(questionId: string): boolean {
    return this.answers.hasOwnProperty(questionId);
  }
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.examStarted && !this.examSubmitted) {
      event.preventDefault();
      event.returnValue =
        'Are you sure you want to leave? Your progress may be lost.';
    }
    return event;
  }
  ngOnInit(): void {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId')!;
    this.route.queryParams.subscribe((params) => {
      this.subjectName = params['subjectName'];
    });
    this.userId = this.authService.getId();
    this.examService.requestExam(this.userId!, this.subjectId).subscribe({
      next: (data) => {
        this.exam = data.data!;
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Exam Generated',
          detail: 'Exam is Ready to Start',
        });
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

  startExam() {
    this.examStarted = true;
    const now = new Date();
    const endTime = new Date(
      now.getTime() + this.exam.durationInMinutes * 60000
    );
    localStorage.setItem('examStartTime', now.toISOString());
    const questionIds = this.exam.questions.map((q) => q.id);
    localStorage.setItem('examQuestionIds', JSON.stringify(questionIds));

    this.startTimer(endTime);
  }
  startTimer(end: Date) {
    this.timer = setInterval(() => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(this.timer);
        this.submitExam();
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        this.timeLeft = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 1000);
  }
  submitExam() {
    this.isLoading = true;
    clearInterval(this.timer);

    const questionIds: string[] = JSON.parse(
      localStorage.getItem('examQuestionIds') || '[]'
    );
    const savedAnswers = this.answers;

    const fullAnswerList: ExamQuestionDTO[] = questionIds.map((qid) => ({
      questionId: qid,
      selectedChoiceId: savedAnswers[qid] ?? null, // null if not answered
    }));

    const payload: StudentExamDTO = {
      submittedAt: new Date().toISOString(),
      examId: this.exam.examId,
      questions: fullAnswerList,
    };
    console.log('Submitted:', payload);
    this.examService.submitExam(payload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Exam Submitted',
          detail: res.message,
        });
        this.isLoading = false;
        this.examSubmitted = true;
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
  nextQuestion() {
    if (this.currentPage < this.exam.questions.length - 1) {
      this.currentPage++;
    }
  }

  prevQuestion() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (!this.examStarted || this.examSubmitted) return;

    if (event.key === 'ArrowRight') {
      this.nextQuestion();
    }

    if (event.key === 'ArrowLeft') {
      this.prevQuestion();
    }
  }
}
