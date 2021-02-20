import { ProductName } from './ProductName';
import { left, Result, right } from './../../shared/core/Result';
import { CreateProductResponse } from './CreateProductResponse';
import { CreateProductCommandDTO } from './CreateProductCommandDTO';
import { ProductRepository } from './ProductRepository';
import { Inject, Service } from "typedi";
import { IUseCaseCommandCQRS } from '../../shared/core/IUseCase';
import { ProductPrice } from './ProductPrice';
import { ApplicationError } from '../../shared/core/ApplicationError';
import { CreateProductErrors } from './CreateProductErrors';
import { Product } from './Product';
import { ProductMapper } from './ProductMapper';

@Service()
export class CreateProductUseCase implements IUseCaseCommandCQRS<CreateProductCommandDTO, Promise<CreateProductResponse>> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository

    async execute(param: CreateProductCommandDTO): Promise<CreateProductResponse> {
        const productNameOrError = ProductName.create({ value: param.name })
        const productPriceOrError = ProductPrice.create({ value: param.price })

        const dtoResults = Result.combine([
            productNameOrError,
            productPriceOrError
        ])

        if (dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))

        const name = productNameOrError.getValue()
        const price = productPriceOrError.getValue()

        try {
            const isExist = await this._productRepository.isExist(name)
            if (isExist)
                return left(new CreateProductErrors.NameAlreadyExistsError(name.value))
            const productOrError = Product.create({ name, price, categoryId: param.categoryId });

            if (productOrError.isFailure)
                return left(Result.fail(productOrError.error!.toString()))
            const product = productOrError.getValue();
            const productDb = ProductMapper.toPersistence(product)
            
            try {
                const id = await this._productRepository.create(productDb)
                if(!id)
                    return left(new CreateProductErrors.DataCannotSave())
                return right(Result.OK(id))
            } catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError(error))
            }
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
