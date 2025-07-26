import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaginatedResponse } from "../Interfaces/PaginatedResponse";
import { SubjectResponse } from "../Interfaces/SubjectResponse";
import { ApiResponse } from "../Interfaces/APIResponse";
import { SubjectDTO } from "../Interfaces/SubjectDTO";

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  constructor(private httpClient: HttpClient) {
    
  }
  getAllSubject(params : HttpParams){
    return this.httpClient
          .get<PaginatedResponse<SubjectResponse>>('Subjects', { params });
  }
  deleteSubject(subjectId:string){
    return this.httpClient.delete<ApiResponse<string>>(`Subjects/${subjectId}`);
  }
  updateSubject(subjectId:string,subjectData : SubjectDTO){
    return this.httpClient.put<ApiResponse<string>>(`Subjects/${subjectId}`,subjectData);
  }
  createSubject(subjectData : SubjectDTO){
    return this.httpClient.post<ApiResponse<string>>(`Subjects`,subjectData);
  }
}