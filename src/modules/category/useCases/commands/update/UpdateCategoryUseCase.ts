import { Inject, Service } from 'typedi';
import { CategoryMapper } from '../../../infra/CategoryMapper';
import { Category } from '../../../domain/aggregateRoot/Category';
import { UpdateCategoryResponse } from './UpdateCategoryResponse';
import { UpdateCategoryCommandDTO } from './UpdateCategoryCommandDTO';
import { CategoryRepository } from '../../../repositories/CategoryRepository';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { CategoryName } from '../../../domain/valueObjects/CategoryName';
import { left, Result, right } from '../../../../../shared/core/Result';
import { UpdateCategoryErrors } from './UpdateCategoryErrors';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';

@Service()
export class UpdateCategoryUseCase implements IUseCaseCommandCQRS<UpdateCategoryCommandDTO, Promise<UpdateCategoryResponse>> {
    @Inject('category.repository')
    private _categoryRepository: CategoryRepository;
    
    async execute(param: UpdateCategoryCommandDTO): Promise<UpdateCategoryResponse> {
        const isExist = await this._categoryRepository.getById(param.id)

        if(!isExist)
            return left(new UpdateCategoryErrors.NotFoundError(param.id)) as UpdateCategoryResponse
        
        const categoryNameOrError = CategoryName.create({ name: param.name })
        
        if(categoryNameOrError.isFailure) {
            return left(Result.fail<CategoryName>(categoryNameOrError.error)) as UpdateCategoryResponse;
        }
        const name: CategoryName = categoryNameOrError.getValue()
        const categoryOrError: Result<Category> = Category.create({ name });

        if(categoryOrError.isFailure) {
            return left(Result.fail<Category>(categoryOrError.error)) as UpdateCategoryResponse
        }
        const category: Category = categoryOrError.getValue()
        const categoryDb = CategoryMapper.toPersistence(category)

        try {
            const isExist = await this._categoryRepository.isExist(name)
            if(isExist) {
                return left(
                    new UpdateCategoryErrors.NameAlreadyExistsError(param.name)
                ) as UpdateCategoryResponse
            }
            try {
                const isUpdated = await this._categoryRepository.update(param.id, categoryDb)
                return right(Result.OK<boolean>(isUpdated))
            } 
            catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError(error))
            }
            
        } catch (error) {
            
        }
    }
}
