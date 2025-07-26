import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExamQuestionDTO } from '../../../Interfaces/ExamQuestionDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-question',
  imports: [FormsModule,CommonModule],
  templateUrl: './exam-question.html',
  styleUrl: './exam-question.css',
})
export class ExamQuestion {
  @Input() question!: any;
  @Input() selectedChoiceId!: number;

  @Output() answered = new EventEmitter<ExamQuestionDTO>();
  
  selectChoice(choiceId: number) {
    this.answered.emit({ questionId: this.question.id, selectedChoiceId: choiceId });
  }
}
