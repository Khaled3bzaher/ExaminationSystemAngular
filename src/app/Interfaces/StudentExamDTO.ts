import { ExamQuestionDTO } from "./ExamQuestionDTO";

export interface StudentExamDTO {
  examId: string;
  questions: ExamQuestionDTO[];
}