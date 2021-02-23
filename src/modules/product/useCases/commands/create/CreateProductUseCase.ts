import { CategoryRepository } from './../../../../category/repositories/CategoryRepository';
import { left, Result, right } from '../../../../../shared/core/Result';
import { CreateProductResponse } from './CreateProductResponse';
import { CreateProductCommandDTO } from './CreateProductCommandDTO';
import { Inject, Service } from "typedi";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ProductPrice } from '../../../domain/valueObjects/ProductPrice';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { CreateProductErrors } from './CreateProductErrors';
import { ProductMapper } from '../../../infra/ProductMapper';
import { ProductName } from '../../../domain/valueObjects/ProductName';
import { Product } from '../../../domain/aggregateRoot/Product';
import { ProductRepository } from '../../../repositories/ProductRepository';
import { CategoryId } from '../../../../category/domain/entity/CategoryId';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';

@Service()
export class CreateProductUseCase implements IUseCaseCommandCQRS<CreateProductCommandDTO, Promise<CreateProductResponse>> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async execute(param: CreateProductCommandDTO): Promise<CreateProductResponse> {
        const productNameOrError = ProductName.create({ value: param.name })
        const productPriceOrError = ProductPrice.create({ value: param.price })
        const categoryIdOrError = CategoryId.create(new UniqueEntityId(param.categoryId))

        const dtoResults = Result.combine([
            productNameOrError,
            productPriceOrError,
            categoryIdOrError
        ])

        if (dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))

        const name = productNameOrError.getValue()
        const price = productPriceOrError.getValue()
        const categoryId = categoryIdOrError.getValue()

        try {
            const isExist = await this._productRepository.isNameExist(name.value)
            if (isExist)
                return left(new CreateProductErrors.NameAlreadyExistsError(name.value))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }

        try {
            const isExist = await this._categoryRepository.isExist(categoryId.id.toString())
            if(!isExist)
                return left(new CreateProductErrors.CategoryNotFoundError())
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
        const productOrError = Product.create({ name, price, categoryId });

        if (productOrError.isFailure)
            return left(Result.fail(productOrError.error!.toString()))
        const product = productOrError.getValue();
        const productDb = ProductMapper.toPersistence(product)
        try {
            const id = await this._productRepository.create(productDb)
            if (!id)
                return left(new CreateProductErrors.DataCannotSave())
            return right(Result.OK(id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
