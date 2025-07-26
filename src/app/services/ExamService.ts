import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../Interfaces/APIResponse';
import { StudentExamResponse } from '../Interfaces/StudentExamResponse';
import { StudentExamDTO } from '../Interfaces/StudentExamDTO';
import { PaginatedResponse } from '../Interfaces/PaginatedResponse';
import { ExamHistoryResponse } from '../Interfaces/ExamHistoryResponse';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private http = inject(HttpClient);
  requestExam(studentId:string,subjectId:string){
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('subjectId', subjectId)

    return this.http.get<ApiResponse<StudentExamResponse>>('Exams/RequestExam',{params})
  }
  submitExam(examData: StudentExamDTO){
    return this.http.post<ApiResponse<string>>('Exams/SubmitExam',examData);
  }
  examsHistory(params:HttpParams){
    return this.http.get<ApiResponse<PaginatedResponse<ExamHistoryResponse>>>('Exams/ExamsHistory',{params});
  }
}
