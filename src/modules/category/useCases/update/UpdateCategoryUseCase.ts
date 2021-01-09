import { CategoryMapper } from '../../infra/CategoryMapper';
import { Category } from '../../domain/aggregateRoot/Category';
import { UpdateCategoryResponse } from './UpdateCategoryResponse';
import { IUpdateCategoryDTO } from './IUpdateCategoryDTO';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { IUseCase } from "../../../../shared/core/IUserCase";
import { CategoryName } from '../../domain/valueObjects/CategoryName';
import { left, Result, right } from '../../../../shared/core/Result';
import { UpdateCategoryErrors } from './UpdateCategoryErrors';
import { ApplicationError } from '../../../../shared/core/ApplicationError';

export class UpdateCategoryUseCase implements IUseCase<IUpdateCategoryDTO, Promise<UpdateCategoryResponse>> {
    private _categoryRepository: CategoryRepository
    
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    
    async execute(param: IUpdateCategoryDTO): Promise<UpdateCategoryResponse> {
        const isExist = await this._categoryRepository.getById(param.id)

        if(!isExist)
            return left(new UpdateCategoryErrors.NotFoundError(param.id)) as UpdateCategoryResponse
        
        const categoryNameOrError = CategoryName.create({ name: param.name })
        
        if(categoryNameOrError.isFailure) {
            return left(Result.fail(categoryNameOrError.error)) as UpdateCategoryResponse;
        }
        const name: CategoryName = categoryNameOrError.getValue()
        const categoryOrError: Result<Category> = Category.create({ name });

        if(categoryOrError.isFailure) {
            return left(Result.fail<Category>(categoryOrError.error)) as UpdateCategoryResponse
        }
        const category: Category = categoryOrError.getValue()
        const categoryDb = CategoryMapper.toPersistence(category)

        try {
            const isUpdated = await this._categoryRepository.update(param.id, categoryDb)
            return right(Result.OK<boolean>(isUpdated ? true : false))
        } catch (error) {
            console.log(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
