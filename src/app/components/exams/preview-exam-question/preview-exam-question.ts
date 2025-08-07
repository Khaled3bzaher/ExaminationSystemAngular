import { Component, Input } from '@angular/core';
import { PreviewExamQuestionResponse } from '../../../Interfaces/PreviewExamQuestionResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-exam-question',
  imports: [CommonModule],
  templateUrl: './preview-exam-question.html',
  styleUrl: './preview-exam-question.css'
})
export class PreviewExamQuestion {
  @Input() question!: PreviewExamQuestionResponse;
}
