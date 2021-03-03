import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../shared/core/Result";
import { CreateCategoryErrors } from "../../handlers/errors/CreateCategoryErrors";

export type CreateCategoryResponse = Either<
    CreateCategoryErrors.NameAlreadyExistsError |
    CreateCategoryErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>
