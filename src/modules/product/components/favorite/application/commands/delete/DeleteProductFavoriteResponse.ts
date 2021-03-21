import { ApplicationError } from "../../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../../shared/core/Result";
import { DeleteProductFavoriteErrors } from "./DeleteProductFavoriteErrors";

export type DeleteProductFavoriteResponse = Either<
    DeleteProductFavoriteErrors.DataCannotSave |
    DeleteProductFavoriteErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
