import { CategoryMapper } from '../../../infra/CategoryMapper';
import { GetCategoryByIdResponse } from './GetCategoryByIdResponse';
import { CategoryRepository } from '../../../repositories/CategoryRepository';
import { IUseCaseQueryCQRS } from '../../../../../shared/core/IUseCase';
import { GetCategoryByIdQueryDTO } from './GetCategoryByIdQueryDTO';
import { CategoryId } from '../../../domain/entity/CategoryId';
import { left, Result, right } from '../../../../../shared/core/Result';
import { GetCategoryByIdErrors } from './GetCategoryByIdErrors';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Category } from '../../../domain/aggregateRoot/Category';
import { Inject, Service } from 'typedi';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';

@Service()
export class GetCategoryByIdUseCase implements IUseCaseQueryCQRS<GetCategoryByIdQueryDTO, Promise<GetCategoryByIdResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;

    async execute(param: GetCategoryByIdQueryDTO): Promise<GetCategoryByIdResponse> {
        const idOrError = CategoryId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure) {
            return left(Result.fail<CategoryId>(idOrError.error)) as GetCategoryByIdResponse;
        }
        const categoryId: CategoryId = idOrError.getValue()
        try {
            const category = await this._categoryRepository.getById(categoryId.id.toString())
            if(!category)
                return left(
                    new GetCategoryByIdErrors.NotFoundError()
                ) as GetCategoryByIdResponse

            const categoryMapper = CategoryMapper.toDomain(category)
            
            if(!categoryMapper) 
                return left(Result.fail(GetCategoryByIdErrors.NotFoundError)) as GetCategoryByIdResponse
            
            return right(Result.OK<Category>(categoryMapper));
        } 
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error)) as GetCategoryByIdResponse
        }
    }
}
name
