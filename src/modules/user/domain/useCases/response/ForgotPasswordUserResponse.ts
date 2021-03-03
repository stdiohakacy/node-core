import { Either, Result } from '../../../../../shared/core/Result';
import { ForgotPasswordUserErrors } from '../errors/ForgotPasswordUserErrors';

export type ForgotPasswordUserResponse = Either<
    ForgotPasswordUserErrors.CannotSaveError |
    ForgotPasswordUserErrors.DataInvalidError |
    ForgotPasswordUserErrors.EmailNotFoundError |
    Result<any>,
    Result<boolean>
>
