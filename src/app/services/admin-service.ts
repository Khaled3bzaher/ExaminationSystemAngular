import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../Interfaces/APIResponse';
import { StatsResponse } from '../Interfaces/StatsResponse';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http= inject(HttpClient);
  getStats(){
    return this.http.get<ApiResponse<StatsResponse>>('Admin/Stats');
  }
}
