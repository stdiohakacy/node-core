import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';
import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";

export namespace LogoutUserErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor () {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `user`).message
            })
        }
    }
}
