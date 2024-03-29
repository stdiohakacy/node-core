import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { UpdateCategoryErrors } from "./UpdateCategoryErrors";

export type UpdateCategoryResponse = Either<
    UpdateCategoryErrors.NotFoundError |
    UpdateCategoryErrors.NameAlreadyExistsError |
    UpdateCategoryErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
