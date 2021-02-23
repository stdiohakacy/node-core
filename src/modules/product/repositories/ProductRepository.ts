import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../shared/repository/BaseRepository';
import { ProductName } from '../domain/valueObjects/ProductName';
import { ProductDb } from '../infra/databases/typeorm/entities/ProductDb';

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
