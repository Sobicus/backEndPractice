export enum statusType{
    Success='Success',
    notFound='notFound',
}
export type ObjectResult<D>={
    status: statusType
    errorMessages?: string
    data:D
}