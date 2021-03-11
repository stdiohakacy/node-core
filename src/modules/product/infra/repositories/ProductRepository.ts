import { Service } from 'typedi';
import { BaseRepository } from '../../../../shared/repository/BaseRepository';
import { IProductRepository } from '../adapter/IProductRepository';
import { ProductDb } from '../databases/typeorm/entities/ProductDb';

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

    async deleteByCategory(categoryId: string): Promise<boolean> {
        const isDeleted = await this.repository
            .createQueryBuilder('product')
            .softDelete()
            .where(`categoryId = :categoryId`, { categoryId })
            .execute();
        return !!isDeleted.affected
    }

    async findByCategory(filter: any, categoryId: string): Promise<[ProductDb[], number]> {
        const query = this.repository
            .createQueryBuilder('product')
            .where('product.categoryId = :categoryId', { categoryId })
            .skip(filter.skip)
            .take(filter.limit)

        return await query.getManyAndCount()
    }
}
