import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ExamHistoryResponse } from '../../../Interfaces/ExamHistoryResponse';
import { ExamService } from '../../../services/ExamService';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { HttpParams } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DatePipe } from '@angular/common';
import { AutoComplete } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-examshistory',
  imports: [
    TableModule,
    ProgressSpinner,
    Toast,
    AvatarModule,
    PaginatorModule,
    DatePipe,
    AutoComplete,
    FormsModule,
  ],
  templateUrl: './examshistory.html',
  styleUrl: './examshistory.css',
})
export class Examshistory {
  examsHistory = signal<ExamHistoryResponse[]>([]);
  selectedExam: ExamHistoryResponse | null = null;
  @Output() onSelectExam = new EventEmitter<ExamHistoryResponse>();
  isLoading = true;
  private examService = inject(ExamService);
  private authService = inject(Auth);
  studentId = '';
  pageSize = 5;
  pageIndex = 0;
  search = '';
  sorting = 'CreatedAtAsc';
  totalCount = signal(0);
  isAuthenticated :Boolean = false;

  constructor(private router: Router, private messageService: MessageService) {
    this.authService.isAuthenticatedSubject.subscribe((res) => {
      this.isAuthenticated = this.authService.isAuthenticatedSubject.getValue();
      if(!this.isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    const studentIdFromState = history.state?.studentId;
    if (studentIdFromState) {
      this.studentId = studentIdFromState;
    } else if (
      this.authService.isAuthenticatedSubject &&
      !this.authService.isAdmin()
    ) {
      this.studentId = this.authService.getId()!;
    }
    console.log(studentIdFromState);
    this.loadExams();
  }
  loadExams() {
    const params = new HttpParams()
      .set('sorting', this.sorting)
      .set('PageIndex', this.pageIndex + 1)
      .set('PageSize', this.pageSize)
      .set('search', this.search)
      .set('studentId', this.studentId);
    this.examService.examsHistory(params).subscribe({
      next: (res) => {
        this.examsHistory.set(res.data!.data);
        this.totalCount.set(res.data!.totalCount);
        this.isLoading = false;
      },
      error: (err) => {
        if (!err.error.data) {
          this.examsHistory.set([]);
          this.totalCount.set(0);
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
  onRowSelect(event: any) {
    this.selectedExam = event.data;
    if (this.selectedExam) {
      this.messageService.add({
        severity: 'success',
        summary: 'Exam History',
        detail: 'Exam Status: ' + this.selectedExam.examStatus,
      });
      this.onSelectExam.emit(this.selectedExam);
    }
  }
  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.loadExams();
  }

  sortingOptions = [
    { label: 'Student Name (A-Z)', value: 'NameAsc' },
    { label: 'Student Name (Z-A)', value: 'NameDesc' },
    { label: 'Created At (Oldest)', value: 'CreatedAtAsc' },
    { label: 'Created At (Newest)', value: 'CreatedAtDesc' },
    { label: 'Exam Status (A-Z)', value: 'StatusAsc' },
    { label: 'Exam Status (Z-A)', value: 'StatusDesc' },
  ];
  filteredSortingOptions: any[] = [];

  // Method to filter options
  filterSorting(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let option of this.sortingOptions) {
      if (option.label.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(option);
      }
    }

    this.filteredSortingOptions = filtered;
  }
  onSortChange(event: any) {
    console.log('Selected sorting:', event.value);
    this.pageIndex = 0;
    this.loadExams();
  }
  onSearch() {
    this.pageIndex = 0;
    this.loadExams();
  }
}
