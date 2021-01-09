import { CategoryMapper } from '../../infra/CategoryMapper';
import { GetCategoryByIdResponse } from './GetCategoryByIdResponse';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { IUseCase } from '../../../../shared/core/IUserCase';
import { IGetCategoryByIdDTO } from './IGetCategoryById';
import { CategoryId } from '../../domain/entity/CategoryId';
import { UniqueEntityId } from '../../../../shared/core/UniqueEntityId';
import { left, Result, right } from '../../../../shared/core/Result';
import { GetCategoryByIdErrors } from './GetCategoryByIdErrors';
import { ApplicationError } from '../../../../shared/core/ApplicationError';
import { Category } from '../../domain/aggregateRoot/Category';

export class GetCategoryByIdUseCase implements IUseCase<IGetCategoryByIdDTO, Promise<GetCategoryByIdResponse>> {
    private _categoryRepository: CategoryRepository
    
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    
    async execute(param: IGetCategoryByIdDTO): Promise<GetCategoryByIdResponse> {
        const idOrError = CategoryId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure) {
            return left(Result.fail(idOrError.error)) as GetCategoryByIdResponse;
        }
        const categoryId: CategoryId = idOrError.getValue()
        try {
            const category = await this._categoryRepository.getById(categoryId.id.toString())
            if(!category) {
                return left(Result.fail(GetCategoryByIdErrors.NotFoundError)) as GetCategoryByIdResponse
            }

            const categoryMapper: Category | null = CategoryMapper.toDomain(category)
            if(!categoryMapper) {
                return left(Result.fail(GetCategoryByIdErrors.NotFoundError)) as GetCategoryByIdResponse
            }
            return right(Result.OK<Category>(categoryMapper));
        } 
        catch (error) {
            return left(ApplicationError.UnexpectedError) as GetCategoryByIdResponse
        }
    }
}
