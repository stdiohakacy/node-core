import { CategoryDb } from '../../domain/entity/CategoryDb';
import { ICreateCategoryDTO } from './ICreateCategoryDTO';
import { CategoryRepository } from './../../repositories/CategoryRepository';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { IUseCase } from './../../../../shared/core/IUserCase';
import { left, Result } from '../../../../shared/core/Result';
import { CreateCategoryErrors } from './CreateCategoryErrors';
import { CategoryName } from '../../domain/valueObjects/CategoryName';
export class CreateCategoryUseCase implements IUseCase<ICreateCategoryDTO, Promise<CreateCategoryResponse>> {
    private _categoryRepository: CategoryRepository
    
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    
    async execute(param: ICreateCategoryDTO): Promise<CreateCategoryResponse> {
        const categoryNameOrError = CategoryName.create({ name: param.name })
        if(categoryNameOrError.isFailure) {
            return left(Result.fail(categoryNameOrError.error)) as CreateCategoryResponse;
        }
        try {
            const isExist = await this._categoryRepository.isExist(param.name)
            if(isExist) {
                return left(
                    new CreateCategoryErrors.NameAlreadyExistsError(param.name)
                ) as CreateCategoryResponse
            }
        } 
        catch (error) {
            console.log(error)    
        }
        const data = new CategoryDb()
        data.name = param.name
        return await this._categoryRepository.create(data)
    }
}
