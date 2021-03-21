import { Service } from 'typedi';
import { ProductFavoriteDb } from '../../../../../infra/ProductFavoriteDb';
import { BaseRepository } from '../../../../../shared/repository/BaseRepository';
import { IProductFavoriteRepository } from '../adapter/IProductFavoriteRepository';

@Service('product_favorite.repository')
export class ProductFavoriteRepository extends BaseRepository<ProductFavoriteDb, string> implements IProductFavoriteRepository {
    constructor() {
        super(ProductFavoriteDb, {
            TABLE_NAME: 'product_favorite'
        })
    }

    async isIdExist(id: string): Promise<boolean> {
        return await this.repository.count({ id }) > 0
    }

    async isExist(userId: string, productId: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('product_favorite')
            .where(`product_favorite.userId = :userId`, { userId })
            .andWhere(`product_favorite.productId = :productId`, { productId })

        return !!await query.getOne();
    }
}
