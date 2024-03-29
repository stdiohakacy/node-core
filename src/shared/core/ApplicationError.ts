
import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";

export namespace ApplicationError {
    export class UnexpectedError extends Result<UseCaseError> {
        public constructor (err?: any) {
            super(false, {
                message: 'Something went wrong',
                error: err
            } as UseCaseError)
            console.log(`[ApplicationError]: An unexpected error occurred`);
            console.error(err);
        }

        public static create (err: any): UnexpectedError {
            return new UnexpectedError(err);
        }
    }
}
