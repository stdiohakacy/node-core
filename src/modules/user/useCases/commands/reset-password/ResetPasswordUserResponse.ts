import { Either, Result } from '../../../../../shared/core/Result';
import { ResetPasswordUserErrors } from './ResetPasswordUserErrors';

export type ResetPasswordUserResponse = Either<
    ResetPasswordUserErrors.CannotSaveError |
    ResetPasswordUserErrors.EmailNotFoundError |
    ResetPasswordUserErrors.ForgotKeyInvalidError |
    Result<any>,
    Result<boolean>
>
