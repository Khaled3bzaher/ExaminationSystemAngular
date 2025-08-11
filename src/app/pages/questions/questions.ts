import { Component, inject, signal, ViewChild } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { QuestionsService } from '../../services/questions-service';
import { QuestionResponse } from '../../Interfaces/QuestionResponse';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CreateQuestionDTO } from '../../Interfaces/CreateQuestionDTO';
import { QuestionChoiceDTO } from '../../Interfaces/QuestionChoiceDTO';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-questions',
  imports: [
    ToolbarModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    InputTextModule,
    InputText,
    Dialog,
    SelectModule,
    RadioButton,
    RadioButtonModule,
    ProgressSpinner,
    FormsModule,
    ConfirmDialog,
  ],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class Questions {
  isLoading = true;
  private questionsService = inject(QuestionsService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  subjectQuestions = signal<QuestionResponse[]>([]);
  totalCount = signal(0);
  subjectId!: string;
  subjectName!: string;
  pageSize = 5;
  pageIndex = 0;
  search = '';
  sortField = 'questionLevel';
  sortOrder = 1;
  questionDialog: boolean = false;
  submitted = false;
  question!: CreateQuestionDTO;
  questionLevels = [
    { label: 'LOW', value: 0 },
    { label: 'NORMAL', value: 1 },
    { label: 'HIGH', value: 2 },
  ];

  ngOnInit() {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId')!;
    this.route.queryParams.subscribe((params) => {
      this.subjectName = params['subjectName'];
    });
    this.LoadQuestions();
    this.cols = [
      { field: 'text', header: 'Question' },
      { field: 'questionLevel', header: 'Question Level' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }
  @ViewChild('dt') dt!: Table;
  cols!: Column[];
  exportColumns!: ExportColumn[];

  exportCSV() {
    this.dt.exportCSV();
  }
  inputSearch(event: any) {
    this.search = event.target.value;
    this.dt!.onLazyLoad.emit({
      first: 0,
      rows: this.pageSize,
      globalFilter: this.search,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    });
  }
  sortFieldMap: Record<string, string> = {
    questionLevel: 'Level',
  };
  LoadQuestions() {
    const backendField = this.sortFieldMap[this.sortField] || this.sortField;
    const sorting = backendField
      ? `${backendField}${this.sortOrder === -1 ? 'Desc' : 'Asc'}`
      : '';
    const params = new HttpParams()
      .set('SubjectId', this.subjectId)
      .set('pageIndex', this.pageIndex + 1)
      .set('pageSize', this.pageSize)
      .set('search', this.search)
      .set('sorting', sorting);
    this.questionsService.getSubjectQuestions(params).subscribe((res) => {
      this.subjectQuestions.set(res.data);
      this.totalCount.set(res.totalCount);
      this.isLoading=false;
    });
  }
  editQuestion(question: QuestionResponse) {
    console.log(question);
  }
  deleteQuestion(question: QuestionResponse) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + question.text + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text',
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes',
      },
      accept: () => {
        this.questionsService.deleteQuestion(question.id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Question Deleted',
              life: 3000,
            });
            this.LoadQuestions();
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }
  onLazyChange(event: any) {
    const pageIndex = event.first / event.rows;
    const pageSize = event.rows;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (event.globalFilter !== undefined && event.globalFilter !== null) {
      this.search = event.globalFilter;
    }

    this.sortOrder = event.sortOrder ?? 1;
    this.LoadQuestions();
  }
  openNew() {
    this.question = {
      SubjectId: this.subjectId,
      Text: '',
      QuestionLevel: 0,
      Choices: [
        { Text: '', isCorrect: false },
        { Text: '', isCorrect: false },
        { Text: '', isCorrect: false },
        { Text: '', isCorrect: false },
      ],
    };

    this.submitted = false;
    this.questionDialog = true;
  }
  correctChoice!: QuestionChoiceDTO;

  setCorrectChoice(choice: QuestionChoiceDTO) {
    this.question.Choices.forEach((c) => (c.isCorrect = false));
    choice.isCorrect = true;
    this.correctChoice = choice;
  }
  hideDialog() {
    this.questionDialog = false;
    this.submitted = false;
  }
  saveQuestion() {
  this.submitted = true;

  const isTextValid = this.question.Text && this.question.Text.trim().length > 0;
  const isLevelValid = this.question.QuestionLevel !== null && this.question.QuestionLevel !== undefined;
  const areChoicesFilled = this.question.Choices.every(c => c.Text && c.Text.trim().length > 0);
  const isOneCorrect = this.question.Choices.filter(c => c.isCorrect).length === 1;

  if (!isTextValid || !isLevelValid || !areChoicesFilled || !isOneCorrect) {
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill all required fields and choose exactly one correct answer.',
    });
    return;
  }

  this.questionsService.addSubjectQuestion(this.question).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Question Created',
        life: 3000,
      });
      this.questionDialog = false;
      this.LoadQuestions();
    },
    error: (err) => {
      console.log(err);
    },
  });
}
hasExactlyOneCorrectChoice(): boolean {
  return Array.isArray(this.question?.Choices) &&
         this.question.Choices.filter(c => c.isCorrect).length === 1;
}
  getCorrectAnswerText(question: QuestionResponse): string {
    return question.choices.find((choice) => choice.isCorrect)?.text || '-';
  }
}
