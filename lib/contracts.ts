export interface IValidationError {
    type: string
    message: string
    path: string
}

export interface IErrorFeedback {
    errors: IValidationError[]
    errorsCount: number
}