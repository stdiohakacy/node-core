import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { DeleteCategoryErrors } from "./DeleteCategoryErrors";


export type DeleteCategoryResponse = Either<
    DeleteCategoryErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
