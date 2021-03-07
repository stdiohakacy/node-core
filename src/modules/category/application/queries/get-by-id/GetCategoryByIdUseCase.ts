import { Inject, Service } from 'typedi';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { IUseCaseQueryCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { CategoryId } from '../../../domain/entities/CategoryId';
import { GetCategoryByIdQueryDTO } from '../../../dtos/GetCategoryByIdQueryDTO';
import { CategoryMapper } from '../../../infra/databases/CategoryMapper';
import { CategoryRepository } from '../../../infra/repositories/CategoryRepository';
import { GetCategoryByIdErrors } from './GetCategoryByIdError';
import { GetCategoryByIdResponse } from './GetCategoryByIdResponse';

@Service()
export class GetCategoryByIdUseCase implements IUseCaseQueryCQRS<GetCategoryByIdQueryDTO, Promise<GetCategoryByIdResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;

    async execute(param: GetCategoryByIdQueryDTO): Promise<GetCategoryByIdResponse> {
        const idOrError = CategoryId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure)
            return left(Result.fail(idOrError.error));

        const categoryId = idOrError.getValue()

        try {
            const category = await this._categoryRepository.getById(categoryId.id.toString())
            if(!category)
                return left(new GetCategoryByIdErrors.NotFoundError(categoryId.id.toString()))

            const categoryMapper = CategoryMapper.toDomain(category)
            return right(Result.OK(categoryMapper));
        } 
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
