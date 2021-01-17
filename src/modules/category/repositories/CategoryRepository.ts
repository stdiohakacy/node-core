import "reflect-metadata"
import { injectable } from 'inversify';
import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { CategoryDb } from '../infra/databases/typeorm/entities/CategoryDb';
import { ICategoryRepository } from './ICategoryRepository';
@injectable()
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
