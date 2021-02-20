import { ProductName } from './ProductName';
import { Service } from 'typedi';
import { BaseRepository } from '../../shared/repository/BaseRepository';
import { IBaseRepository } from '../../shared/repository/IBaseRepository';
import { ProductDb } from './infra/databases/typeorm/entities/ProductDb';

export interface IProductRepository extends IBaseRepository<ProductDb, string> {
    isExist(productName: ProductName): Promise<boolean>
}

@Service('product.repository')
export class ProductRepository extends BaseRepository<ProductDb, string> implements IProductRepository {
    constructor() {
        super(ProductDb, {
            TABLE_NAME: 'product'
        })
    }

    async isExist(productName: ProductName): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('product')
            .where(`LOWER(product.name) = LOWER(:name)`, { name: productName.value });

        return !!await query.getOne();
    }
}
