import { PreviewExamQuestionResponse } from "./PreviewExamQuestionResponse";

export interface PreviewExamResponse {
  subjectName: string;
  createdAt: string;        
  submittedAt: string;      
  examStatus: string;       
  result: number;
  questions: PreviewExamQuestionResponse[];
}
