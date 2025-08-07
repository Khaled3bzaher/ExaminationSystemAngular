import { ExamQuestionChoiceResponse } from "./ExamQuestionChoiceResponse";

export interface PreviewExamQuestionResponse {
  id: string;                        
  text: string;
  choices: ExamQuestionChoiceResponse[];
  selectedChoiceId: number;
  correctAnswerId:number;
}