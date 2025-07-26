import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaginatedResponse } from '../Interfaces/PaginatedResponse';
import { QuestionResponse } from '../Interfaces/QuestionResponse';
import { CreateQuestionDTO } from '../Interfaces/CreateQuestionDTO';
import { ApiResponse } from '../Interfaces/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private http=inject(HttpClient);
  getSubjectQuestions(params : HttpParams){
    return this.http.get<PaginatedResponse<QuestionResponse>>('Questions',{ params });
  }
  addSubjectQuestion(question:CreateQuestionDTO){
    return this.http.post<ApiResponse<string>>('Questions',question);
  }
  deleteQuestion(questionId:string){
    return this.http.delete<ApiResponse<string>>(`Questions/${questionId}`);
  }
}
