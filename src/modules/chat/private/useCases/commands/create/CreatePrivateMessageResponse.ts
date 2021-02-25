import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../../shared/core/Result';
import { CreatePrivateMessageErrors } from './CreatePrivateMessageErrors';

export type CreatePrivateMessageResponse = Either<
    CreatePrivateMessageErrors.UserNotFoundError |
    CreatePrivateMessageErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>
