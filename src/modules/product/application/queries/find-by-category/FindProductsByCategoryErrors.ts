import { Result } from "../../../../../shared/core/Result";
import { UseCaseError } from "../../../../../shared/core/UseCaseError";
import { MessageError, SystemError } from "../../../../../shared/exceptions/SystemError";

export namespace FindProductsByCategoryErrors {
    export class NotFoundError extends Result<UseCaseError> {    
        constructor (id: string) {
            super(false, {
                message: new SystemError(MessageError.PARAM_NOT_EXISTS, `category ${id}`).message
            })
        }
    }
}
