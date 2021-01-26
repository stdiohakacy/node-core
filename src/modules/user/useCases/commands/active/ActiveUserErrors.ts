import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ActiveUserErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Not found error'
            } as UseCaseError)
        }
    }
    export class ActiveKeyInvalid extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Active key invalid'
            } as UseCaseError)
        }
    }

    export class ExpiredTimeError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Expired time error'
            })
        }
    }

    export class UserStatusError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'User status error'
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
