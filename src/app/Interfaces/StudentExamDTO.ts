import { ExamQuestionDTO } from "./ExamQuestionDTO";

export interface StudentExamDTO {
  submittedAt: string;
  examId: string;
  questions: ExamQuestionDTO[];
}