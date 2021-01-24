import { CategoryName } from './../../../domain/valueObjects/CategoryName';
import { Result } from '../../../../../shared/core/Result';
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either } from "../../../../../shared/core/Result";
import { UpdateCategoryErrors } from "./UpdateCategoryErrors";
import { Category } from '../../../domain/aggregateRoot/Category';

export type UpdateCategoryResponse = Either<
    UpdateCategoryErrors.NotFoundError |
    UpdateCategoryErrors.AlreadyExistsError |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>
