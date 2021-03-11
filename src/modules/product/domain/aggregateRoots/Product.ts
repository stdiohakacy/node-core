import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { CategoryId } from "../../../category/domain/entities/CategoryId";
import { ProductId } from "../entities/ProductId";
import { ProductName } from "../valueObjects/ProductName";
import { ProductPrice } from "../valueObjects/ProductPrice";
import { ProductTags } from "../watchedList/ProductTags";

export interface IProductProps {
    name: ProductName
    price: ProductPrice
    categoryId: CategoryId
    tags?: ProductTags
}

export class Product extends AggregateRoot<IProductProps> {
    private constructor (props: IProductProps, id?: UniqueEntityId) {
        super(props, id)
    }

    get productId (): ProductId {
        return ProductId.create(this._id).getValue();
    }

    get name (): ProductName {
        return this.props.name;
    }

    get price (): ProductPrice {
        return this.props.price;
    }

    get categoryId (): CategoryId {
        return this.props.categoryId;
    }

    get tags(): ProductTags {
        return this.props.tags
    }

    public static create (props: IProductProps, id?: UniqueEntityId): Result<Product> {
        const guard = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: 'name' },
            { argument: props.price, argumentName: 'price' },
            { argument: props.categoryId, argumentName: 'category id' },
        ])
        if(!guard.succeeded)
            return Result.fail<Product>(guard.message)

        const product = new Product({...props}, id)
        return Result.OK<Product>(product);
    }
}
