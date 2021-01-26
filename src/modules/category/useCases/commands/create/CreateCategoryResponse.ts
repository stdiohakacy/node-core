import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { CreateCategoryErrors } from "./CreateCategoryErrors";

export type CreateCategoryResponse = Either<
  CreateCategoryErrors.AlreadyExistsError |
  CreateCategoryErrors.DataCannotSave |
  ApplicationError.UnexpectedError |
  Result<any>,
  Result<string>
>
