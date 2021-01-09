import { ApplicationError } from "../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../shared/core/Result";
import { DeleteCategoryErrors } from "./DeleteCategoryErrors";

export type DeleteCategoryResponse = Either<
    ApplicationError.UnexpectedError | 
    DeleteCategoryErrors.CategoryNotFoundError,
    Result<boolean>
>
