import { Result } from "../../../../../shared/core/Result";
import { Entity } from "../../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";
import { MessageError, SystemError } from "../../../../../shared/exceptions/SystemError";

export class ProductDetailId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<ProductDetailId> {
        if (!id)
            return Result.fail<ProductDetailId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'product detail id').message
            )
        return Result.OK<ProductDetailId>(new ProductDetailId(id));
    }
}
