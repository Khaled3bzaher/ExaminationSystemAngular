import { QuestionChoiceResponse } from "./QuestionChoiceResponse";

export interface QuestionResponse{
    id:string,
    text:string,
    QuestionLevel:string,
    choices:QuestionChoiceResponse[],
}