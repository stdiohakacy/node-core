import { Guard } from '../../../../../../shared/core/Guard';
import { Result } from '../../../../../../shared/core/Result';
import { Entity } from '../../../../../../shared/domain/Entity';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { ProductColor } from '../../enum/ProductColor';

export interface IProductDetail {
    size: number
    color: ProductColor
}

export class ProductDetail extends Entity<IProductDetail> {
    get size(): number {
        return this.props.size
    }

    get color(): ProductColor {
        return this.props.color
    }

    public static create(props: IProductDetail, id?: UniqueEntityId): Result<ProductDetail> {
        const guard = Guard.againstNullOrUndefinedBulk([
            { argument: props.size, argumentName: 'size' },
            { argument: props.color, argumentName: 'color' },
        ])
        if (!guard.succeeded)
            return Result.fail<ProductDetail>(guard.message)

        const product = new ProductDetail({ ...props }, id)
        return Result.OK<ProductDetail>(product);
    }
}