import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from './../../../../../shared/core/Result';

export type ResendActivationUserResponse = Either<
    ApplicationError.UnexpectedError | 
    Result<any>,
    Result<boolean>
>
