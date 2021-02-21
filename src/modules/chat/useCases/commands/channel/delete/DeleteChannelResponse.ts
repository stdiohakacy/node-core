import { Result } from './../../../../../../shared/core/Result';
import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either } from "../../../../../../shared/core/Result";
import { DeleteChannelErrors } from "./DeleteChannelErrors";

export type DeleteChannelResponse = Either<
    DeleteChannelErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
