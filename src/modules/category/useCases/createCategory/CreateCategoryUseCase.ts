import { CategoryRepository } from './../../repositories/CategoryRepository';
import { CreateCategoryDTO } from './CreateCategoryDTO';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { IUseCase } from './../../../../shared/core/IUserCase';
export class CreateCategoryUseCase implements IUseCase<CreateCategoryDTO, Promise<CreateCategoryResponse>> {
    private _categoryRepository: CategoryRepository
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    
    async execute(request?: any): Promise<CreateCategoryResponse> {
        return await this._categoryRepository.create(request)
        // throw new Error('Method not implemented.');
    }
}
