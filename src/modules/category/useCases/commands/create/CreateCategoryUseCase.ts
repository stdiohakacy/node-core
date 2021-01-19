import { ICreateCategoryDTO } from './ICreateCategoryDTO';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { IUseCase } from '../../../../../shared/core/IUserCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { CreateCategoryErrors } from './CreateCategoryErrors';
import { CategoryName } from '../../../domain/valueObjects/CategoryName';
import { Category } from '../../../domain/aggregateRoot/Category';
import { CategoryDb } from '../../../infra/databases/typeorm/entities/CategoryDb';
import { CategoryMapper } from '../../../infra/CategoryMapper';
import { Inject, Service } from 'typedi';
import { ICategoryRepository } from '../../../repositories/ICategoryRepository';
import { CategoryRepository } from '../../../repositories/CategoryRepository';

@Service()
export class CreateCategoryUseCase implements IUseCase<ICreateCategoryDTO, Promise<CreateCategoryResponse>> {
    @Inject('category.repository')
    private _categoryRepository: CategoryRepository;

    async execute(param: ICreateCategoryDTO): Promise<CreateCategoryResponse> {
        const categoryNameOrError = CategoryName.create({ name: param.name })
        if(categoryNameOrError.isFailure) {
            return left(Result.fail(categoryNameOrError.error)) as CreateCategoryResponse;
        }
        const name: CategoryName = categoryNameOrError.getValue();
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
