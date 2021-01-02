import { getRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { Category } from './../domain/entity/Category';
import { ICategoryRepository } from './ICategoryRepository';

export class CategoryRepository implements ICategoryRepository<Category> {
    private readonly _categoryRepository: Repository<Category>
    constructor() {
        this._categoryRepository = getRepository(Category)
    }

    findAndCount(): Promise<[Category, number]> {
        throw new Error('Method not implemented.');
    }
    getById(id: string): Promise<Category> {
        throw new Error('Method not implemented.');
    }
    async create(data: any): Promise<string> {
        await this._categoryRepository.save(data)
        return 'created'
    }
    update(id: string, data: any): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    
}
