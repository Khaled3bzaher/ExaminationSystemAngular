import { Component } from '@angular/core';
import { Examshistory } from "../../components/exams/examshistory/examshistory";
import { ExamHistoryResponse } from '../../Interfaces/ExamHistoryResponse';

@Component({
  selector: 'app-exams',
  imports: [Examshistory],
  templateUrl: './exams.html',
  styleUrl: './exams.css'
})
export class Exams {
  
}
