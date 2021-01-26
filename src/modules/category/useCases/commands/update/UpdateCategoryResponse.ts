import { Result } from '../../../../../shared/core/Result';
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either } from "../../../../../shared/core/Result";
import { UpdateCategoryErrors } from "./UpdateCategoryErrors";

export type UpdateCategoryResponse = Either<
    UpdateCategoryErrors.NotFoundError |
    UpdateCategoryErrors.AlreadyExistsError |
    UpdateCategoryErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
