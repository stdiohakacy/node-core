import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from './../../../../../shared/core/Result';

export namespace ResendActivationUserErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Not found error'
            } as UseCaseError)
        }
    }

    export class UserStatusError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'User status error'
            } as UseCaseError)
        }
    }

    export class CannotSaveError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: 'Cannot save error'
            } as UseCaseError)
        }
    }
}
