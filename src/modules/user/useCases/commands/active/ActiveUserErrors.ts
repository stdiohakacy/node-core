import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace ActiveUserErrors {
    export class DataInvalidError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'Data Invalid Error'
            } as UseCaseError)
        }
    }

    export class ExpiredTimeError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'expired time error'
            })
        }
    }

    export class CannotSaveError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: 'cannot save error'
            })
        }
    }
}
