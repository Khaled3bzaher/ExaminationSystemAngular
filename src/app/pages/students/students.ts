import { Component, inject, signal } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { StudentsService } from '../../services/students';
import { StudentResponse } from '../../Interfaces/StudentResponse';
import { HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  imports: [
    Toast,
    ProgressSpinner,
    FormsModule,
    AutoComplete,
    TableModule,
    AvatarModule,
    Paginator,
    ToggleSwitchModule,
    CommonModule,
  ],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  constructor(private router: Router, private messageService: MessageService) {}

  isLoading = true;
  private studentsService = inject(StudentsService);
  pageSize = 5;
  pageIndex = 0;
  search = '';
  sorting = { label: 'Student Name (A-Z)', value: 'NameAsc' };
  totalCount = signal(0);
  students = signal<StudentResponse[]>([]);
  selectedStudent: StudentResponse | null = null;
  ngOnInit() {
    this.loadStudents();
  }
  loadStudents() {
    const params = new HttpParams()
      .set('sorting', this.sorting.value)
      .set('PageIndex', this.pageIndex + 1)
      .set('PageSize', this.pageSize)
      .set('search', this.search);

    this.studentsService.getStudents(params).subscribe({
      next: (res) => {
        this.students.set(res.data);
        this.totalCount.set(res.totalCount);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        if (!err.error.data) {
          this.students.set([]);
          this.totalCount.set(0);
          this.isLoading = false;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error,
        });
      },
    });
  }
  onSearch() {
    this.pageIndex = 0;
    this.loadStudents();
  }
  sortingOptions = [
    { label: 'Student Name (A-Z)', value: 'NameAsc' },
    { label: 'Student Name (Z-A)', value: 'NameDesc' },
    { label: 'Disabled', value: 'ActiveAsc' },
    { label: 'Enabled', value: 'ActiveDesc' },
  ];
  filteredSortingOptions: any[] = [...this.sortingOptions];

  // Method to filter options
  filterSorting(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSortingOptions = this.sortingOptions.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }
  onSortChange(event: any) {
    this.sorting = event.value;
    this.pageIndex = 0;
    this.loadStudents();
  }
  onRowSelect(event: any) {
    this.selectedStudent = event.data;
    if (this.selectedStudent) {
      this.router.navigate(['/exams'], {
        state: { studentId: this.selectedStudent.id },
      });
    }
  }
  changeStudentStatus(student: StudentResponse) {
    this.studentsService.toggleStudentStatus(student.id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: student!.isActive === true ? 'success' : 'warn',
          summary: 'Student Status',
          detail: res.message,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Student Status',
          detail: err.error.message,
        });
      },
    });
  }
  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.loadStudents();
  }
}
