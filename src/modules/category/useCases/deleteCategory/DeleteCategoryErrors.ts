import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteCategoryErrors {
    export class CategoryNotFoundError extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `Category not found`
            } as UseCaseError)
        }
    }
}
