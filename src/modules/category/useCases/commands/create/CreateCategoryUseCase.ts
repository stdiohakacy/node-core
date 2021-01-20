import { CreateCategoryCommandDTO } from './CreateCategoryCommandDTO';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { CreateCategoryErrors } from './CreateCategoryErrors';
import { CategoryName } from '../../../domain/valueObjects/CategoryName';
import { Category } from '../../../domain/aggregateRoot/Category';
import { CategoryMapper } from '../../../infra/CategoryMapper';
import { Inject, Service } from 'typedi';
import { CategoryRepository } from '../../../repositories/CategoryRepository';

@Service()
export class CreateCategoryUseCase implements IUseCaseCommandCQRS<CreateCategoryCommandDTO, Promise<CreateCategoryResponse>> {
    @Inject('category.repository')
    private _categoryRepository: CategoryRepository;

    async execute(param: CreateCategoryCommandDTO): Promise<CreateCategoryResponse> {
        const categoryNameOrError = CategoryName.create({ name: param.name })
        if(categoryNameOrError.isFailure) {
            return left(Result.fail<CategoryName>(categoryNameOrError.error)) as CreateCategoryResponse;
        }
        const name: CategoryName = categoryNameOrError.getValue();
        try {
            const isExist = await this._categoryRepository.isExist(name)
            if(isExist) {
                return left(
                    new CreateCategoryErrors.NameAlreadyExistsError()
                ) as CreateCategoryResponse
            }
        } 
        
        catch (error) {
            console.log(error)    
        }
        const categoryOrError: Result<Category> = Category.create({ name });

        if (categoryOrError.isFailure) {
            return left(
              Result.fail<Category>(categoryOrError.error!.toString())
            ) as CreateCategoryResponse;
        }

        const category: Category = categoryOrError.getValue();

        const categoryDb = CategoryMapper.toPersistence(category)
        const id = await this._categoryRepository.create(categoryDb)

        return right(Result.OK(id))
    }
}
