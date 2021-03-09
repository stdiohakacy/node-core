import { Service } from 'typedi';
import { IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { ProductDb } from '../databases/typeorm/entities/ProductDb';

export interface IProductRepository extends IBaseRepository<ProductDb, string> {
    isExist(id: string): Promise<boolean>
    isNameExist(name: string): Promise<boolean>
}
