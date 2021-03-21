import { Service } from "typedi";
import { ProductTagDb } from "../../../../../infra/ProductTagDb";
import { BaseRepository } from "../../../../../shared/repository/BaseRepository";
import { IProductTagRepository } from "../adapter/IProductTagRepository";

@Service('product_tag.repository')
export class ProductTagRepository extends BaseRepository<ProductTagDb, string> implements IProductTagRepository {
    constructor() {
        super(ProductTagDb, {
            TABLE_NAME: 'product_tag'
        })
    }
    
    async deleteByProductId(productId: string): Promise<boolean> {
        const isDeleted = this.repository
            .createQueryBuilder('product_tag')
            .delete()
            .where('product_tag.productId = :productId', { productId })
            .execute()

        return !!isDeleted
    }
}
