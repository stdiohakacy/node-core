import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";


export type UpdateProductResponse = Either<
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
