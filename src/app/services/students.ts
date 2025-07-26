import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaginatedResponse } from '../Interfaces/PaginatedResponse';
import { StudentResponse } from '../Interfaces/StudentResponse';
import { ApiResponse } from '../Interfaces/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private http = inject(HttpClient);
  getStudents(params:HttpParams){
    return this.http.get<PaginatedResponse<StudentResponse>>('Students',{params});
  }
  toggleStudentStatus(studentId:string){
    return this.http.put<ApiResponse<string>>('Students/'+studentId,null);
  }
}
