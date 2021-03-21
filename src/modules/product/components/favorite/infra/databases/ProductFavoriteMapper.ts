import { ProductFavoriteDb } from "../../../../../../infra/ProductFavoriteDb"
import { IMapper } from "../../../../../../shared/IMapper"
import { ProductFavorite } from "../../domain/valueObjects/ProductFavorite"

export class ProductFavoriteMapper implements IMapper<ProductFavorite> {
    public static toPersistence(productFavorite: ProductFavorite): ProductFavoriteDb {
        const productFavoriteDb = new ProductFavoriteDb()

        if (productFavorite.userId)
            productFavoriteDb.userId = productFavorite.userId.id.toString()
        if (productFavorite.productId)
            productFavoriteDb.productId = productFavorite.productId.id.toString()
        if (productFavorite.status)
            productFavoriteDb.status = productFavorite.status

        return productFavoriteDb
    }
}
