import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from "primeng/button";

@Component({
  selector: 'app-exam-instruction',
  imports: [Button],
  templateUrl: './exam-instruction.html',
  styleUrl: './exam-instruction.css'
})
export class ExamInstruction {
  @Output() accepted = new EventEmitter<void>();
  @Input() durationInMinutes!: number;
  @Input() examName!: string;
  onAccept() {
      this.accepted.emit();
    }
}
