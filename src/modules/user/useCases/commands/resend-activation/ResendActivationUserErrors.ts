import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from './../../../../../shared/core/Result';

export namespace ResendActivationUserErrors {
    export class EmailNotFoundError extends Result<UseCaseError> {    
        constructor (email: string) {
            super(false, {
                message: `The email ${email} was not found!`
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
        constructor () {
            super(false, {
                message: 'Cannot save error'
            })
        }
    }
}
