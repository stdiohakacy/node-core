import { Inject, Service } from 'typedi';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';
import { DeleteCategoryCommandDTO } from '../../../dtos/DeleteCategoryCommandDTO';
import { CategoryRepository } from '../../../infra/repositories/CategoryRepository';
import { DeleteCategoryErrors } from './DeleteCategoryErrors';
import { DeleteCategoryResponse } from './DeleteCategoryResponse';
import * as validator from 'class-validator'

@Service()
export class DeleteCategoryUseCase implements IUseCaseCommandCQRS<DeleteCategoryCommandDTO, Promise<DeleteCategoryResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;
    
    async execute(param: DeleteCategoryCommandDTO): Promise<DeleteCategoryResponse> {
        if(!param.id)
            return left(Result.fail(new SystemError(MessageError.PARAM_REQUIRED, 'category id').message))
        if(!validator.isUUID(param.id))
            return left(Result.fail(new SystemError(MessageError.PARAM_INVALID, 'category id').message))

        try {
            const isExist = await this._categoryRepository.isExist(param.id)
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
