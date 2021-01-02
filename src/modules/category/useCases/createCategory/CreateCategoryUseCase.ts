import { Category } from './../../domain/entity/Category';
import { ICreateCategoryDTO } from './ICreateCategoryDTO';
import { CategoryRepository } from './../../repositories/CategoryRepository';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { IUseCase } from './../../../../shared/core/IUserCase';
export class CreateCategoryUseCase implements IUseCase<ICreateCategoryDTO, Promise<CreateCategoryResponse>> {
    private _categoryRepository: CategoryRepository
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    async execute(param: ICreateCategoryDTO): Promise<CreateCategoryResponse> {
        const data = new Category()
        data.name = param.name
        return await this._categoryRepository.create(data)
    }
}
