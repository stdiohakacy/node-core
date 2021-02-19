import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../../shared/core/Result';
import { GetChannelSingleErrors } from './GetChannelSingleErrors';

export type GetChannelSingleResponse = Either<
    GetChannelSingleErrors.DataCannotSave |
    GetChannelSingleErrors.ReceiverNotfoundError |
    GetChannelSingleErrors.TokenInvalidError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>
