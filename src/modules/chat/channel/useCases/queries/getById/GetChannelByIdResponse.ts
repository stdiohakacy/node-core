import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../shared/core/Result";
import { Channel } from "../../../domain/aggregateRoot/Channel";
import { GetChannelByIdErrors } from "./GetChannelByIdErrors";

export type GetChannelByIdResponse = Either<
    GetChannelByIdErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<Channel>
>
