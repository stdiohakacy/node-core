import { getRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { Category } from './../domain/entity/Category';
import { ICategoryRepository } from './ICategoryRepository';

export class CategoryRepository extends BaseRepository<Category, string> {
    constructor(){
        super(Category, {
            TABLE_NAME: 'category'
        })
    }
}
