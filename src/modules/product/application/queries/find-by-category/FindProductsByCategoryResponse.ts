import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { PaginationResult } from "../../../../../shared/core/PaginationResult";
import { Either, Result } from "../../../../../shared/core/Result";
import { Product } from "../../../domain/aggregateRoots/Product";
import { FindProductsByCategoryErrors } from "./FindProductsByCategoryErrors";

export type FindProductsByCategoryResponse = Either<
    FindProductsByCategoryErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<PaginationResult<Product>>
>
