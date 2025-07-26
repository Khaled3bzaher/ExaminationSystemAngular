export interface PaginatedResponse<T>{
    pageIndex:number,
    pageSize:number,
    totalCount:number,
    data :T[]
}