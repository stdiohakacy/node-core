import { CategoryId } from '../../../domain/entity/CategoryId';
import { IDeleteCategoryDTO } from './IDeleteCategoryDTO';
import { IUseCase } from '../../../../../shared/core/IUserCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { DeleteCategoryResponse } from './DeleteCategoryResponse';
import { DeleteCategoryErrors } from './DeleteCategoryErrors';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { ICategoryRepository } from '../../../repositories/ICategoryRepository';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { CategoryRepository } from '../../../repositories/CategoryRepository';

@Service()
export class DeleteCategoryUseCase implements IUseCase<IDeleteCategoryDTO, Promise<DeleteCategoryResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;
    
    async execute(param: IDeleteCategoryDTO): Promise<DeleteCategoryResponse> {
        const idOrError = CategoryId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure)
            return left(Result.fail(idOrError.error)) as DeleteCategoryResponse;
        
        const categoryId: CategoryId = idOrError.getValue()

        try {
            const isExist = await this._categoryRepository.getById(categoryId.id.toString())
            if(!isExist) {
                return left(
                    new DeleteCategoryErrors.NotFoundError(param.id)
                ) as DeleteCategoryResponse
            }
        } 
        catch (error) {
            console.log(error)    
            return left(new ApplicationError.UnexpectedError(error))
        }
        
        return right(Result.OK(true))
    }
}
