import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ActiveUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: `The email ${email} was not found!`
            })
        }
    }
    export class ActiveKeyInvalidError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The active key is invalid`
            })
        }
    }

    export class ExpiredTimeError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'The active key has expired'
            })
        }
    }

    export class UserStatusError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'The user has been activated'
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
