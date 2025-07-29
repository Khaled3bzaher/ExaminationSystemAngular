import { Component, inject, signal } from '@angular/core';
import { SubjectResponse } from '../../Interfaces/SubjectResponse';
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';
import { SubjectService } from '../../services/subjects';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { SubjectDTO } from '../../Interfaces/SubjectDTO';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-subjects',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    AutoComplete,
    ProgressSpinner,
    Toast,
    ConfirmDialog,
    Dialog,
    ReactiveFormsModule,
  ],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class Subjects {
  private router = inject(Router);
  authService = inject(Auth);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      }
    });
  }
  private subjectService = inject(SubjectService);
  isLoading = false;
  selectedSubject: SubjectResponse | null = null;
  displayEditDialog = false;
  displayCreateDialog: boolean = false;
  openCreateDialog() {
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  editForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
  });
  createForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]),
  });
  openEditDialog(subject: SubjectResponse) {
    this.selectedSubject = subject;
    this.editForm.patchValue({
      name: subject.name,
    });
    this.displayEditDialog = true;
  }

  submitEdit() {
    if (!this.selectedSubject || this.editForm.invalid) return;
    this.isLoading = true;

    const updatedSubject: SubjectDTO = {
      Name: this.editForm.value.name,
    };

    this.subjectService
      .updateSubject(this.selectedSubject.id, updatedSubject)
      .subscribe({
        next: () => {
          this.displayEditDialog = false;
          this.loadSubjects();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subject updated successfully',
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Server error:', err.error);
          this.messageService.add({
            severity: 'error',
            summary: err.error.message || 'Error',
            detail: err.error.validationErrors[0]?.errors[0] || 'Failed to update subject',
          });
          this.isLoading = false;
        }
      });
  }

  subjects = signal<SubjectResponse[]>([]);
  totalCount = signal(0);

  pageSize = 5;
  pageIndex = 0;
  search = '';
  sorting = 'NameAsc';

  sortingOptions = [
    { label: 'Name (A-Z)', value: 'NameAsc' },
    { label: 'Name (Z-A)', value: 'NameDesc' },
    { label: 'Created At (Oldest)', value: 'CreatedAtAsc' },
    { label: 'Created At (Newest)', value: 'CreatedAtDesc' },
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
  ngOnInit() {
    this.isLoading = true;
    this.loadSubjects();
  }

  loadSubjects() {
    const params = new HttpParams()
      .set('pageIndex', this.pageIndex + 1)
      .set('pageSize', this.pageSize)
      .set('search', this.search)
      .set('sorting', this.sorting);

    this.subjectService.getAllSubject(params).subscribe({
      next: (res) => {
        this.subjects.set(res.data);
        this.totalCount.set(res.totalCount);
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Internal Server Error',
        });
      },
    });
  }

  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.loadSubjects();
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadSubjects();
  }

  onSortChange(event: any) {
    console.log('Selected sorting:', event.value);
    this.pageIndex = 0;
    this.loadSubjects();
  }

  confirmDelete(subjectId: string) {
    this.confirmationService.confirm({
      header: 'Delete Subject',
      message: 'Please confirm to Delete this Subject.',
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.isLoading = true;
        this.subjectService.deleteSubject(subjectId).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: response.message,
              life: 3000,
            });
            this.loadSubjects();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Server error:', err.error.message);
          },
        });
      }
    });
  }
  submitCreate() {
    if (this.createForm.invalid) return;
    this.isLoading = true;
    const newSubject: SubjectDTO = {
      Name: this.createForm.value.name,
    };
    this.subjectService.createSubject(newSubject).subscribe({
      next: () => {
        this.displayCreateDialog = false;
        this.loadSubjects();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Subject created successfully',
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: err.error.message || 'Error',
          detail: err.error.validationErrors[0]?.errors[0] || 'Failed to create subject',
        });
        this.isLoading = false;
      },
    });
  }
  QuestionsNavigation(subject: SubjectResponse) {
    this.router.navigate(['/subjects', 'questions', subject.id], {
      queryParams: { subjectName: subject.name },
    });
  }
  requestExam(subject: SubjectResponse) {
    this.router.navigate(['/exams', subject.id], {
      queryParams: { subjectName: subject.name },
    });
  }
}
