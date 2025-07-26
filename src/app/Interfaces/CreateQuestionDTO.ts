import { QuestionChoiceDTO } from "./QuestionChoiceDTO";

export interface CreateQuestionDTO{
    SubjectId:string,
    Text:string,
    QuestionLevel:number,
    Choices:QuestionChoiceDTO[]
}