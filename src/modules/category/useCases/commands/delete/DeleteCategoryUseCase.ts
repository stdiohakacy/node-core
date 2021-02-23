import { CategoryId } from '../../../domain/entity/CategoryId';
import { DeleteCategoryCommandDTO } from './DeleteCategoryCommandDTO';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { DeleteCategoryResponse } from './DeleteCategoryResponse';
import { DeleteCategoryErrors } from './DeleteCategoryErrors';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { CategoryRepository } from '../../../repositories/CategoryRepository';

@Service()
export class DeleteCategoryUseCase implements IUseCaseCommandCQRS<DeleteCategoryCommandDTO, Promise<DeleteCategoryResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;
    
    async execute(param: DeleteCategoryCommandDTO): Promise<DeleteCategoryResponse> {
        const idOrError = CategoryId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure)
            return left(Result.fail<CategoryId>(idOrError.error));
        
        const categoryId = idOrError.getValue()

        try {
            const isExist = await this._categoryRepository.isExist(categoryId.id.toString())
            if(!isExist)
                return left(new DeleteCategoryErrors.NotFoundError(param.id))
            const isDeleted = await this._categoryRepository.softDelete(param.id)
            if(!isDeleted)
                return left(new DeleteCategoryErrors.DataCannotSave())
            return right(Result.OK(isDeleted))
        } 
        catch (error) {
            console.log(error)    
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
