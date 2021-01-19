import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { PaginationResult } from "../../../../../shared/core/PaginationResult";
import { Either, Result } from "../../../../../shared/core/Result";
import { Category } from "../../../domain/aggregateRoot/Category";

export type FindCategoriesResponse = Either<
  ApplicationError.UnexpectedError |
  Result<any>,
  Result<PaginationResult<Category>>
>
