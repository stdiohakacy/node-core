import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { ProductDb } from '../databases/typeorm/entities/ProductDb';

export interface IProductRepository extends IBaseRepository<ProductDb, string> {
    isExist(id: string): Promise<boolean>
    isNameExist(name: string): Promise<boolean>
}

@Service('product.repository')
export class ProductRepository extends BaseRepository<ProductDb, string> implements IProductRepository {
    constructor() {
        super(ProductDb, {
            TABLE_NAME: 'product'
        })
    }

    async isExist(id: string): Promise<boolean> {
        return await this.repository.count({ id }) > 0
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('product')
            .where(`LOWER(product.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}
