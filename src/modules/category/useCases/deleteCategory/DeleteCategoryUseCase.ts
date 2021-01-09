import { IDeleteCategoryDTO } from './IDeleteCategoryDTO';
import { IUseCase } from "../../../../shared/core/IUserCase";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { DeleteCategoryResponse } from './DeleteCategoryResponse';
import { left, Result, right } from '../../../../shared/core/Result';
import { DeleteCategoryErrors } from './DeleteCategoryErrors';
import { ApplicationError } from '../../../../shared/core/ApplicationError';

export class DeleteCategoryUseCase implements IUseCase<IDeleteCategoryDTO, Promise<DeleteCategoryResponse>>{
    private _categoryRepository: CategoryRepository
    
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }

    async execute(param: IDeleteCategoryDTO): Promise<DeleteCategoryResponse> {
        try {
            const category = await this._categoryRepository.getById(param.id)
            const isFound = !!category === true
            if(!isFound) {
                return left(
                    new DeleteCategoryErrors.CategoryNotFoundError()
                )
            }
            category.deletedAt = new Date()
            const id = await this._categoryRepository.create(category)
            return right(Result.OK<boolean>(id ? true : false))
        }
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
