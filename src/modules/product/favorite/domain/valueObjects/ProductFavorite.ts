import { Result } from './../../../../../shared/core/Result';
import { Entity } from "../../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";
import { UserId } from "../../../../user/domain/blocks/entity/UserId";
import { ProductId } from "../../../domain/entities/ProductId";
import { Guard } from '../../../../../shared/core/Guard';

interface IProductFavoriteProps {
    userId: UserId
    productId: ProductId
    status: boolean
}

export class ProductFavorite extends Entity<IProductFavoriteProps> {
    get userId(): UserId {
        return this.props.userId
    }

    get productId(): ProductId {
        return this.props.productId
    }

    get status(): boolean {
        return this.props.status
    }

    private constructor(props: IProductFavoriteProps, id?: UniqueEntityId) {
        super(props);
    }

    public static create(props: IProductFavoriteProps, id?: UniqueEntityId): Result<ProductFavorite> {
        const guard = Guard.againstNullOrUndefinedBulk([
            { argument: props.productId, argumentName: 'product id' },
            { argument: props.userId, argumentName: 'user id' },
        ])
        if (!guard.succeeded)
            return Result.fail<ProductFavorite>(guard.message)

        const product = new ProductFavorite({ ...props }, id)
        return Result.OK<ProductFavorite>(product);
    }
}
