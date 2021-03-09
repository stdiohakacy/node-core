import { ApplicationError } from "../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../shared/core/Result";
import { CreateProductErrors } from "./CreateProductErrors";

export type CreateProductResponse = Either<
    CreateProductErrors.NameAlreadyExistsError |
    CreateProductErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>
