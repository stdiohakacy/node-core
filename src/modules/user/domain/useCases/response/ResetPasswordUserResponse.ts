import { Either, Result } from '../../../../../shared/core/Result';
import { ResetPasswordUserErrors } from '../errors/ResetPasswordUserErrors';

export type ResetPasswordUserResponse = Either<
    ResetPasswordUserErrors.CannotSaveError |
    ResetPasswordUserErrors.EmailNotFoundError |
    ResetPasswordUserErrors.ForgotKeyInvalidError |
    Result<any>,
    Result<boolean>
>
