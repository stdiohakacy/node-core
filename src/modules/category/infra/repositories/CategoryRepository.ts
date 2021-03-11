import { Service } from "typedi";
import { CategoryDb } from "../../../../infra/CategoryDb";
import { BaseRepository } from "../../../../shared/repository/BaseRepository";
import { ICategoryRepository } from "../adapter/ICategoryRepository";

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
