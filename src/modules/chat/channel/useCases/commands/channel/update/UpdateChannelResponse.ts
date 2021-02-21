import { ApplicationError } from "../../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../../shared/core/Result";
import { UpdateChannelErrors } from "./UpdateChannelErrors";

export type UpdateChannelResponse = Either<
    UpdateChannelErrors.NotFoundError |
    UpdateChannelErrors.NameAlreadyExistsError |
    UpdateChannelErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
