import { Component, inject, signal, ViewChild } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { SubjectConfigurationResponse } from '../../Interfaces/SubjectConfigurationResponse';
import { HttpParams } from '@angular/common/http';
import { SubjectService } from '../../services/subjects';
import { MessageService } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { SubjectConfigurationDTO } from '../../Interfaces/SubjectConfigurationDTO';

@Component({
  selector: 'app-subject-configurations',
  imports: [TableModule,ProgressSpinner,IconField,InputIcon,Button,FormsModule,Dialog],
  templateUrl: './subject-configurations.html',
  styleUrl: './subject-configurations.css'
})
export class SubjectConfigurations {
  isLoading = true;
   pageSize = 5;
  pageIndex = 0;
  search = '';
  sorting = 'NameAsc';
  subjectConfigurations = signal<SubjectConfigurationResponse[]>([]);
  totalCount = signal(0);
  private subjectsService = inject(SubjectService);
  private messageService = inject(MessageService);
  ngOnInit() {
    this.LoadConfigurations();
  }
  onLazyChange(event: any) {
    const pageIndex = event.first / event.rows;
    const pageSize = event.rows;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (event.globalFilter !== undefined && event.globalFilter !== null) {
      this.search = event.globalFilter;
    }
    if (event.sortField && event.sortOrder !== undefined) {
    const direction = event.sortOrder === 1 ? 'Asc' : 'Desc';
    this.sorting = `${event.sortField}${direction}`;
  }
  
    this.LoadConfigurations();
  }
  LoadConfigurations(){
    const params = new HttpParams()
      .set('pageIndex', this.pageIndex + 1)
      .set('pageSize', this.pageSize)
      .set('search', this.search)
      .set('sorting', this.sorting);
      this.subjectsService.getSubjectsConfigurations(params).subscribe({
      next: (response) => {
        this.subjectConfigurations.set(response.data!.data);
        this.totalCount.set(response.data!.totalCount);
        this.isLoading = false;
      },error: (error) => {
        if (!error.error.data) {
          this.subjectConfigurations.set([]);
          this.totalCount.set(0);
          this.isLoading = false;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      }});
  }
    @ViewChild('dt') dt!: Table;

inputSearch(event: any) {
    this.search = event.target.value;
    this.dt!.onLazyLoad.emit({
      first: 0,
      rows: this.pageSize,
      globalFilter: this.search,
    });
  }
  subjectDialog = false;
submitted = false;
editedConfiguration: SubjectConfigurationResponse={
    subjectId: '',
    subjectName: '',
    lowPercentage: 0,
    normalPercentage: 0,
    hardPercentage: 0,
    durationInMinutes: 0,
    questionNumbers: 0,
};
  editConfiguration(configuration: SubjectConfigurationResponse) {
    this.editedConfiguration = { ...configuration }; 
  this.subjectDialog = true;
  }
saveConfiguration() {
  this.submitted = true;

  const totalPercentage = this.editedConfiguration.lowPercentage + this.editedConfiguration.normalPercentage + this.editedConfiguration.hardPercentage;
  if (totalPercentage !== 100) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Percentages must total 100%',
    });
    return;
  }

  if (!this.editedConfiguration.durationInMinutes || !this.editedConfiguration.questionNumbers) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Fields cannot be empty',
    });
    return;
  }
  const configurationData : SubjectConfigurationDTO = {
    lowPercentage: this.editedConfiguration.lowPercentage,
    normalPercentage: this.editedConfiguration.normalPercentage,
    hardPercentage: this.editedConfiguration.hardPercentage,
    durationInMinutes: this.editedConfiguration.durationInMinutes,
    questionNumbers: this.editedConfiguration.questionNumbers,
  };
  this.subjectsService.editSubjectConfiguration(this.editedConfiguration.subjectId,configurationData).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: `${this.editedConfiguration.subjectName} Configuration updated successfully.`,
      });
      this.subjectDialog = false;
      this.LoadConfigurations();
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error.message || err.error.validationErrors[0].errors[0],
      });
    },
  });
}
}
