import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { CategoryDb } from "../databases/typeorm/entities/CategoryDb";
export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(id: string): Promise<boolean>
    isNameExist(name: string): Promise<boolean>
}
@Service('category.repository')
export class CategoryRepository extends BaseRepository<CategoryDb, string> implements ICategoryRepository {
    constructor() {
        super(CategoryDb, {
            TABLE_NAME: 'category'
        })
    }

    async isExist(id: string): Promise<boolean> {
        return await this.repository.count({ id }) > 0
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('category')
            .where(`LOWER(category.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}
