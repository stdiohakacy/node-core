import { MessageError, SystemError } from './../../../../shared/exceptions/SystemError';
import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";

export class CategoryId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<CategoryId> {
        if (!id)
            return Result.fail<CategoryId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'category id').message
            )
        return Result.OK<CategoryId>(new CategoryId(id));
    }
}
