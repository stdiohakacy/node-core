import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ResetPasswordUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: `The email ${email} was not found!`
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

    export class ForgotKeyInvalidError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The forgot key is invalid`
            } as UseCaseError)
        }
    }
}
