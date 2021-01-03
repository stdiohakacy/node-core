import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { CategoryDb } from '../domain/entity/CategoryDb';
import { ICategoryRepository } from './ICategoryRepository';

export class CategoryRepository extends BaseRepository<CategoryDb, string> implements ICategoryRepository {
    constructor(){
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
