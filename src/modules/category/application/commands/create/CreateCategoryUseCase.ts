import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { Inject, Service } from 'typedi';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { CreateCategoryCommandDTO } from '../../../dtos/CreateCategoryCommandDTO';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { CategoryName } from '../../../domain/valueObjects/CategoryName';
import { CreateCategoryErrors } from './CreateCategoryErrors';
import { Category } from '../../../domain/aggregateRoots/Category';
import { CategoryMapper } from '../../../infra/databases/CategoryMapper';
import { CategoryRepository } from '../../../infra/repositories/CategoryRepository';

@Service()
export class CreateCategoryUseCase implements IUseCaseCommandCQRS<CreateCategoryCommandDTO, Promise<CreateCategoryResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;

    async execute(param: CreateCategoryCommandDTO): Promise<CreateCategoryResponse> {
        const categoryNameOrError = CategoryName.create({ value: param.name })
        if(categoryNameOrError.isFailure)
            return left(Result.fail(categoryNameOrError.error));
        
        const name = categoryNameOrError.getValue();
        try {
            const isExist = await this._categoryRepository.isNameExist(name.value)
            if(isExist)
                return left(new CreateCategoryErrors.NameAlreadyExistsError(name.value))
            
            const categoryOrError = Category.create({ name });

            if (categoryOrError.isFailure)
                return left(Result.fail(categoryOrError.error!.toString()));

            const category = categoryOrError.getValue();
            const categoryDb = CategoryMapper.toPersistence(category)
            try {
                const id = await this._categoryRepository.create(categoryDb)
                if(!id)
                    return left(new CreateCategoryErrors.DataCannotSave())
                return right(Result.OK(id))
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
