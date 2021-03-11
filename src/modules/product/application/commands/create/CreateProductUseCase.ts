import { Inject, Service } from "typedi";
import { CreateProductResponse } from './CreateProductResponse';
import { CreateProductErrors } from './CreateProductErrors';
import { IUseCaseCommandCQRS } from "../../../../../shared/core/IUseCase";
import { CreateProductCommandDTO } from "../../../dtos/CreateProductCommandDTO";
import { ProductRepository } from "../../../infra/repositories/ProductRepository";
import { CategoryRepository } from "../../../../category/infra/repositories/CategoryRepository";
import { ProductName } from "../../../domain/valueObjects/ProductName";
import { ProductPrice } from "../../../domain/valueObjects/ProductPrice";
import { CategoryId } from "../../../../category/domain/entities/CategoryId";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";
import { left, Result, right } from "../../../../../shared/core/Result";
import { IProductProps, Product } from "../../../domain/aggregateRoots/Product";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { ProductMapper } from "../../../infra/databases/ProductMapper";

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

        const productProps: IProductProps = {
            name: productNameOrError.getValue(),
            price: productPriceOrError.getValue(),
            categoryId: categoryIdOrError.getValue()
        }

        try {
            const isExist = await this._productRepository.isNameExist(productProps.name.value)
            if (isExist)
                return left(new CreateProductErrors.NameAlreadyExistsError(productProps.name.value))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }

        try {
            const isExist = await this._categoryRepository.isExist(productProps.categoryId.id.toString())
            if(!isExist)
                return left(new CreateProductErrors.CategoryNotFoundError())
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
        const productOrError = Product.create(productProps);

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
