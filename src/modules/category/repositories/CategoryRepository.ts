import { Service } from 'typedi';
import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { IBaseRepository } from "../../../shared/repository/IBaseRepository";
import { CategoryDb } from "../infra/databases/typeorm/entities/CategoryDb";

export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(name: string): Promise<boolean>
}

@Service('category.repository')
export class CategoryRepository extends BaseRepository<CategoryDb, string> implements ICategoryRepository {
    constructor() {
        super(CategoryDb, {
            TABLE_NAME: 'category'
        })
    }

    async isExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('category')
            .where(`LOWER(category.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}
