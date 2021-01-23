import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../shared/core/Result';

export type ActiveUserResponse = Either<
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
