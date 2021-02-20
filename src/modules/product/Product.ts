import { ProductPrice } from './ProductPrice';
import { ProductName } from "./ProductName";
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityId } from '../../shared/domain/UniqueEntityId';
import { ProductId } from './ProductId';
import { Guard } from '../../shared/core/Guard';
import { Result } from '../../shared/core/Result';

interface IProductProps {
    name: ProductName
    price: ProductPrice
    categoryId: string
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

    get categoryId (): string {
        return this.props.categoryId;
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
