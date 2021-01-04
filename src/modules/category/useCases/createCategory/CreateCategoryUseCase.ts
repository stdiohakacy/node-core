import { CategoryDb } from '../../domain/entity/CategoryDb';
import { ICreateCategoryDTO } from './ICreateCategoryDTO';
import { CategoryRepository } from './../../repositories/CategoryRepository';
import { CreateCategoryResponse } from './CreateCategoryResponse';
import { IUseCase } from './../../../../shared/core/IUserCase';
import { left, Result } from '../../../../shared/core/Result';
import { CreateCategoryErrors } from './CreateCategoryErrors';
import { CategoryName } from '../../domain/valueObjects/CategoryName';
import { Category } from '../../domain/aggregateRoot/Category';
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

        const data = new CategoryDb()
        data.name = category.name.value
        return await this._categoryRepository.create(data)
    }
}
