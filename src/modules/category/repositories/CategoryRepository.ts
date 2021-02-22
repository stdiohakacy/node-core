import { CategoryName } from './../domain/valueObjects/CategoryName';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../shared/repository/BaseRepository';
import { CategoryDb } from "../infra/databases/typeorm/entities/CategoryDb";
export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(categoryName: CategoryName): Promise<boolean>
}
@Service('category.repository')
export class CategoryRepository extends BaseRepository<CategoryDb, string> implements ICategoryRepository {
    constructor() {
        super(CategoryDb, {
            TABLE_NAME: 'category'
        })
    }

    async isExist(categoryName: CategoryName): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('category')
            .where(`LOWER(category.name) = LOWER(:name)`, { name: categoryName.value });

        return !!await query.getOne();
    }
}
