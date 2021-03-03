import { Inject, Service } from 'typedi';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { CategoryMapper } from '../../../infra/CategoryMapper';
import { CategoryRepository } from '../../../infra/repositories/CategoryRepository';
import { Category } from '../../blocks/aggregateRoot/Category';
import { CategoryName } from '../../blocks/valueObjects/CategoryName';
import { UpdateCategoryErrors } from '../errors/UpdateCategoryErrors';
import { UpdateCategoryCommandDTO } from '../handlers/dtos/UpdateCategoryCommandDTO';
import { UpdateCategoryResponse } from '../handlers/response/UpdateCategoryResponse';

@Service()
export class UpdateCategoryUseCase implements IUseCaseCommandCQRS<
    UpdateCategoryCommandDTO, 
    Promise<UpdateCategoryResponse>
> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;
    
    async execute(param: UpdateCategoryCommandDTO): Promise<UpdateCategoryResponse> {
        const categoryNameOrError = CategoryName.create({ value: param.name })
        if(categoryNameOrError.isFailure)
            return left(Result.fail(categoryNameOrError.error));
        const name = categoryNameOrError.getValue();

        try {
            const isExist = await this._categoryRepository.isExist(param.id)
            if(!isExist)
                return left(new UpdateCategoryErrors.NotFoundError(param.id))
                
            const categoryOrError = Category.create({ name });

            if (categoryOrError.isFailure) {
                return left(Result.fail(categoryOrError.error!.toString()));
            }
            const category = categoryOrError.getValue()
            const categoryDb = CategoryMapper.toPersistence(category)

            try {
                const isExist = await this._categoryRepository.isNameExist(name.value)
                if(isExist)
                    return left(new UpdateCategoryErrors.NameAlreadyExistsError(name.value))
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
