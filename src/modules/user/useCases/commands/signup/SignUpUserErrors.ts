import { ContentError } from './../../../../../shared/exceptions/MessageError';
import { UseCaseError } from "../../../../../shared/core/UseCaseError"
import { Result } from "../../../../../shared/core/Result"
import { MessageError } from "../../../../../shared/exceptions/MessageError"

export namespace SignUpUserErrors {
    export class EmailAlreadyExistsError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new MessageError(ContentError.PARAM_EXISTED(), 'email').getMessage()
            } as UseCaseError)
        }
    }
}
