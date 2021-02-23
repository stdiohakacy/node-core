import { DeleteProductCommandDTO } from './DeleteProductCommandDTO';
import { Inject, Service } from "typedi";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ProductRepository } from '../../../repositories/ProductRepository';
import { DeleteProductResponse } from './DeleteProductResponse';
import { ProductId } from '../../../domain/entity/ProductId';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { left, Result, right } from '../../../../../shared/core/Result';
import { DeleteProductErrors } from './DeleteProductErrors';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';

@Service()
export class DeleteProductUseCase implements IUseCaseCommandCQRS<
    DeleteProductCommandDTO,
    Promise<DeleteProductResponse>
> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository

    async execute(param: DeleteProductCommandDTO): Promise<DeleteProductResponse> {
        const idOrError = ProductId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure)
            return left(Result.fail<ProductId>(idOrError.error));
        
        const productId = idOrError.getValue()

        try {
            const isExist = await this._productRepository.isExist(productId.id.toString())
            if(!isExist)
                return left(new DeleteProductErrors.NotFoundError(param.id))
        } 
        catch (error) {
            console.log(error)    
            return left(new ApplicationError.UnexpectedError(error))
        }
        try {
            const isDeleted = await this._productRepository.softDelete(param.id)
            if(!isDeleted)
                return left(new DeleteProductErrors.DataCannotSave())
            return right(Result.OK(isDeleted))
        } catch (error) {
            console.log(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
