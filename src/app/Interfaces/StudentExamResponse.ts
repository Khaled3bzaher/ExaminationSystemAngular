import { ExamQuestionResponse } from "./ExamQuestionResponse";

export interface StudentExamResponse{
    examId:string,
    durationInMinutes:number,
    startTime: string;
    questions: ExamQuestionResponse[];
}