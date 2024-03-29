import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { MessageError, SystemError } from "../../../../shared/exceptions/SystemError";

export class ProductId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<ProductId> {
        if (!id)
            return Result.fail<ProductId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'product id').message
            )
        return Result.OK<ProductId>(new ProductId(id));
    }
}
