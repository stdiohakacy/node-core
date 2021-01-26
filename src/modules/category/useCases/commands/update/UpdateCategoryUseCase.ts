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
        const categoryNameOrError = CategoryName.create({ value: param.name })
        if(categoryNameOrError.isFailure)
            return left(Result.fail(categoryNameOrError.error));
        const name = categoryNameOrError.getValue();

        try {
            const isExist = await this._categoryRepository.getById(param.id)
            if(!isExist)
                return left(new UpdateCategoryErrors.NotFoundError())
                
            const categoryOrError = Category.create({ name });

            if (categoryOrError.isFailure) {
                return left(
                    Result.fail(categoryOrError.error!.toString())
                );
            }
            const category = categoryOrError.getValue()
            const categoryDb = CategoryMapper.toPersistence(category)

            try {
                const isExist = await this._categoryRepository.isExist(name)
                if(isExist)
                    return left(new UpdateCategoryErrors.AlreadyExistsError())
                try {
                    const isUpdated = await this._categoryRepository.update(param.id, categoryDb)
                    if(!isUpdated)
                        return left(new UpdateCategoryErrors.DataCannotSave())
                    return right(Result.OK(isUpdated))
                } 
                catch (error) {
                    console.error(error)
                    return left(new ApplicationError.UnexpectedError(error))
                }
                
            } catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError(error))
            }
        } 
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
