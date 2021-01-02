import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { Category } from './../domain/entity/Category';
import { ICategoryRepository } from './ICategoryRepository';

export class CategoryRepository extends BaseRepository<Category, string> implements ICategoryRepository {
    constructor(){
        super(Category, {
            TABLE_NAME: 'category'
        })
    }
}
