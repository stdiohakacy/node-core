import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";

export type FindCategoriesResponse = Either<
  ApplicationError.UnexpectedError |
  Result<any>,
  Result<any>
>
