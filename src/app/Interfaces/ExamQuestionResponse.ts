import { ExamQuestionChoiceResponse } from "./ExamQuestionChoiceResponse";

export interface ExamQuestionResponse {
  id: string,
  text: string,
  choices: ExamQuestionChoiceResponse[];
}
