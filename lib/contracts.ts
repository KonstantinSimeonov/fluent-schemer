export interface IValidationError {
	type: string;
	message: string;
	path: string;
}

export interface IErrorFeedback<TValidated> {
	corrected: TValidated;
	errors: IValidationError[];
	errorsCount: number;
}
