import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId"
import { IMapper } from "../../../../shared/IMapper"
import { Product } from "../../domain/aggregateRoots/Product"
import { ProductName } from "../../domain/valueObjects/ProductName"
import { CategoryId } from "../../../category/domain/entities/CategoryId"
import { ProductPrice } from "../../domain/valueObjects/ProductPrice"
import { ProductDb } from "../../../../infra/ProductDb"

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

        if(product.name.value) 
            productDb.name = product.name.value
        if(product.price.value)
            productDb.price = product.price.value
        if(product.categoryId.id.toString())
            productDb.categoryId = product.categoryId.id.toString()

        console.log(productDb)
        return productDb
    }
}
