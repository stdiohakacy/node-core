import { UpdateProductResponse } from './UpdateProductResponse';
import { UpdateProductCommandDTO } from './../../../dtos/UpdateProductCommandDTO';
import { Inject, Service } from 'typedi';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { left, Result, right } from '../../../../../shared/core/Result';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { ProductName } from '../../../domain/valueObjects/ProductName';
import { ProductPrice } from '../../../domain/valueObjects/ProductPrice';
import { CategoryRepository } from '../../../../category/infra/repositories/CategoryRepository';
import { UpdateProductErrors } from './UpdateProductErrors';
import { IProductProps, Product } from '../../../domain/aggregateRoots/Product';
import { CategoryId } from '../../../../category/domain/entities/CategoryId';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { ProductMapper } from '../../../infra/databases/ProductMapper';
import { ProductDb } from '../../../infra/databases/typeorm/entities/ProductDb';

@Service()
export class UpdateProductUseCase implements IUseCaseCommandCQRS<
UpdateProductCommandDTO,
Promise<UpdateProductResponse>
> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository;

    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;

    async execute(param: UpdateProductCommandDTO): Promise<UpdateProductResponse> {
        const productNameOrError = ProductName.create({ value: param.name })
        const productPriceOrError = ProductPrice.create({ value: param.price })

        const dtoResults = Result.combine([
            productNameOrError,
            productPriceOrError
        ])

        if(dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))

        try {
            const isExist = await this._productRepository.isExist(param.id)
            if(!isExist)
                return left(new UpdateProductErrors.NotFoundError(param.id))

            const isNameExist = await this._productRepository.isNameExist(productNameOrError.getValue().value)
            if(isNameExist)
                return left(new UpdateProductErrors.NameAlreadyExistsError(param.name))
            if(param.categoryId) {
                const isCategoryExist = await this._categoryRepository.isExist(param.categoryId)
                if(!isCategoryExist) {
                    return left(new UpdateProductErrors.CategoryNotFoundError(param.categoryId))
                }
            }

            const productProps: IProductProps = {
                name: productNameOrError.getValue(),
                price: productPriceOrError.getValue(),
                categoryId: CategoryId.create(new UniqueEntityId(param.categoryId)).getValue()
            }
            const productOrError = Product.create(productProps)
            if(productOrError.isFailure) {
                return left(Result.fail(productOrError.error))
            }

            const product = productOrError.getValue()
            const productDb = ProductMapper.toPersistence(product)
            try {
                const isUpdated = await this._productRepository.update(param.id, productDb)
                if(!isUpdated)
                    return left(new UpdateProductErrors.DataCannotSave())
                return right(Result.OK(isUpdated))
            } catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError())
            }
        } catch (error) {
            console.log(error)
            return left(new ApplicationError.UnexpectedError())
        }
    }
}
