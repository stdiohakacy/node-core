import { ProductFavoriteRepository } from '../../../infra/repositories/ProductFavoriteRepository';
import { Inject, Service } from "typedi";
import { IUseCaseCommandCQRS } from "../../../../../../../shared/core/IUseCase";
import { DeleteProductFavoriteCommandDTO } from '../../../dtos/DeleteProductFavoriteCommandDTO';
import { DeleteProductFavoriteResponse } from './DeleteProductFavoriteResponse';
import { left, Result, right } from '../../../../../../../shared/core/Result';
import { MessageError, SystemError } from '../../../../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import { DeleteProductFavoriteErrors } from './DeleteProductFavoriteErrors';
import { ApplicationError } from '../../../../../../../shared/core/ApplicationError';

@Service()
export class DeleteProductFavoriteUseCase implements IUseCaseCommandCQRS<DeleteProductFavoriteCommandDTO, Promise<DeleteProductFavoriteResponse>> {
    @Inject('product_favorite.repository')
    private readonly _productFavoriteRepository: ProductFavoriteRepository;

    async execute(param: DeleteProductFavoriteCommandDTO): Promise<DeleteProductFavoriteResponse> {
        if(!param.id)
            return left(Result.fail(new SystemError(MessageError.PARAM_REQUIRED, 'product favorite').message))
        if(!validator.isUUID(param.id))
            return left(Result.fail(new SystemError(MessageError.PARAM_INVALID, 'product favorite').message))

        try {
            const isExist = await this._productFavoriteRepository.isIdExist(param.id)
            if(!isExist)
                return left(new DeleteProductFavoriteErrors.NotFoundError())
            const isDeleted = await this._productFavoriteRepository.delete(param.id)
            if(!isDeleted)
                return left(new DeleteProductFavoriteErrors.DataCannotSave())
            return right(Result.OK(isDeleted))
        } 
        catch (error) {
            console.log(error)    
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
