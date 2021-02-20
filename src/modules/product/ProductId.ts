import { Result } from "../../shared/core/Result";
import { Entity } from "../../shared/domain/Entity";
import { UniqueEntityId } from "../../shared/domain/UniqueEntityId";

export class ProductId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<ProductId> {
        return Result.OK<ProductId>(new ProductId(id));
    }
}
