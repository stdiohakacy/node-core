import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Category } from "../../../domain/aggregateRoots/Category";
import { GetCategoryByIdErrors } from "./GetCategoryByIdError";

export type GetCategoryByIdResponse = Either<
    GetCategoryByIdErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<Category>
>
