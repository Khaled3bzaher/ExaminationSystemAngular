import { ExamQuestionResponse } from "./ExamQuestionResponse";

export interface StudentExamResponse{
    examId:string,
    studentName:string,
    subjectName:string,
    durationInMinutes:number,
    startTime: string;
    questions: ExamQuestionResponse[];
}