import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Either, Result } from '../../../../../shared/core/Result';
import { SignUpUserErrors } from '../errors/SignUpUserErrors';

export type SignUpUserResponse = Either<
    SignUpUserErrors.EmailAlreadyExistsError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
