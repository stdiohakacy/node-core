import { PaginationResult } from "../../../../../shared/core/PaginationResult";
import { Either, Result } from "../../../../../shared/core/Result";
import { Category } from "../../blocks/aggregateRoot/Category";

export type FindCategoriesResponse = Either<
    Result<any>,
    Result<PaginationResult<Category>>
>
