import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId"
import { IMapper } from "../../../../shared/IMapper"
import { Product } from "../../domain/aggregateRoots/Product"
import { ProductName } from "../../domain/valueObjects/ProductName"
import { CategoryId } from "../../../category/domain/entities/CategoryId"
import { ProductDb } from "./typeorm/entities/ProductDb"
import { ProductPrice } from "../../domain/valueObjects/ProductPrice"

export class ProductMapper implements IMapper<Product> {
    public static toDomain (productDb: ProductDb): Product | null {
        if(!productDb)
            return null
        const productOrError = Product.create({
            name: ProductName.create({value: productDb.name}).getValue(),
            price: ProductPrice.create({value: productDb.price}).getValue(),
            categoryId: CategoryId.create(new UniqueEntityId(productDb.categoryId)).getValue() 
        }, new UniqueEntityId(productDb.id))

        if(productOrError.isFailure)
            console.error(productOrError.error)

        return productOrError.isSuccess ? productOrError.getValue() : null
    }

    public static toPersistence (product: Product): ProductDb {
        const productDb = new ProductDb()

        productDb.name = product.name && product.name.value
        productDb.price = product.price && product.price.value
        productDb.categoryId = product.categoryId && product.categoryId.id.toString()

        return productDb
    }
}
