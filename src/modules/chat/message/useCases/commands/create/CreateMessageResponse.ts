import { Result } from '../../../../../../shared/core/Result';
import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either } from "../../../../../../shared/core/Result";
import { CreateMessageErrors } from "./CreateMessageErrors";

export type CreateMessageResponse = Either<
    CreateMessageErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>
