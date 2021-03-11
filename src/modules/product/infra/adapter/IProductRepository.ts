import { ProductDb } from '../../../../infra/ProductDb';
import { IBaseRepository } from '../../../../shared/repository/BaseRepository';

export interface IProductRepository extends IBaseRepository<ProductDb, string> {
    isExist(id: string): Promise<boolean>
    isNameExist(name: string): Promise<boolean>
    deleteByCategory(categoryId: string): Promise<boolean>
    findByCategory(filter: any, categoryId: string): Promise<[ProductDb[], number]>
}
