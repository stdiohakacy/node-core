import { Inject, Service } from 'typedi';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { DeleteProductCommandDTO } from '../../../dtos/DeleteProductCommandDTO';
import { DeleteProductResponse } from './DeleteProductResponse'
import { DeleteProdutErrors } from './DeleteProdutErrors';

@Service()
export class DeleteProductUseCase implements IUseCaseCommandCQRS<DeleteProductCommandDTO, Promise<DeleteProductResponse>> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository;

    async execute(param: DeleteProductCommandDTO): Promise<DeleteProductResponse> {
        if (!param.id)
            return left(Result.fail(new SystemError(MessageError.PARAM_REQUIRED, 'product id').message))
        if (!validator.isUUID(param.id))
            return left(Result.fail(new SystemError(MessageError.PARAM_INVALID, 'product id').message))
        try {
            const isExist = await this._productRepository.isExist(param.id)
            if (!isExist)
                return left(new DeleteProdutErrors.NotFoundError(param.id))
            const isDeleted = await this._productRepository.softDelete(param.id)
            if (!isDeleted)
                return left(new DeleteProdutErrors.DataCannotSave())
            return right(Result.OK(isDeleted))
        }
        catch (error) {
            console.log(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
