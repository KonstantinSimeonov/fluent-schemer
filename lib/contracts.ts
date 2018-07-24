export interface IValidationError {
	type: string;
	message: string;
	path: string;
}

export interface IErrorFeedback<TValidated> {
	errors: IValidationError[];
	errorsCount: number;
	corrected: TValidated;
}
