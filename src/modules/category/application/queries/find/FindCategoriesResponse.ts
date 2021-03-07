import { PaginationResult } from "../../../../../shared/core/PaginationResult";
import { Either, Result } from "../../../../../shared/core/Result";
import { Category } from "../../../domain/aggregateRoots/Category";

export type FindCategoriesResponse = Either<
    Result<any>,
    Result<PaginationResult<Category>>
>
