import { UpdateCategoryResponse } from './UpdateCategoryResponse';
import { IUpdateCategoryDTO } from './IUpdateCategoryDTO';
import { CategoryRepository } from './../../repositories/CategoryRepository';
import { IUseCase } from "../../../../shared/core/IUserCase";
import { CategoryName } from '../../domain/valueObjects/CategoryName';
import { left, Result } from '../../../../shared/core/Result';

export class CreateCategoryUseCase implements IUseCase<IUpdateCategoryDTO, Promise<UpdateCategoryResponse>> {
    private _categoryRepository: CategoryRepository
    
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    
    async execute(param: IUpdateCategoryDTO): Promise<any> {
        
    }
}
