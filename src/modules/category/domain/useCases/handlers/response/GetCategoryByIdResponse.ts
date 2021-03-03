import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../shared/core/Result";
import { Category } from "../../../blocks/aggregateRoot/Category";
import { GetCategoryByIdErrors } from "../../handlers/errors/GetCategoryByIdErrors";

export type GetCategoryByIdResponse = Either<
    GetCategoryByIdErrors.NotFoundError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<Category>
>
