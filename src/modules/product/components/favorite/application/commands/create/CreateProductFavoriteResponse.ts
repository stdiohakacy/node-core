import { ApplicationError } from "../../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../../shared/core/Result";

export type CreateProductFavoriteResponse = Either<
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>
