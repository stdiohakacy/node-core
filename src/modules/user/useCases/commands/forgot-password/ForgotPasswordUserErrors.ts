import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ForgotPasswordUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: `The email ${email} was not found!`
            })
        }
    }

    export class DataInvalidError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: `Data is invalid!`
            })
        }
    }

    export class CannotSaveError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Cannot save error'
            })
        }
    }
}
