import { ProductDetailDb } from './../../../../../infra/ProductDetailDb';
import { ProductDetailRepository } from './../../../components/detail/infra/repositories/ProductDetailRepository';
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
import { TagDb } from "../../../../../infra/TagDb";
import { ProductTagDb } from "../../../../../infra/ProductTagDb";
import { TagRepository } from "../../../components/tag/repositories/TagRepository";
import { ProductTagRepository } from "../../../components/tag/repositories/ProductTagRepository";
import { TagMapper } from "../../../components/tag/TagMapper";

@Service()
export class CreateProductUseCase implements IUseCaseCommandCQRS<CreateProductCommandDTO, Promise<CreateProductResponse>> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository
    @Inject('tag.repository')
    private readonly _tagRepository: TagRepository
    @Inject('product_tag.repository')
    private readonly _productTagRepository: ProductTagRepository
    @Inject('product_detail.repository')
    private readonly _productDetailRepository: ProductDetailRepository

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
            categoryId: categoryIdOrError.getValue(),
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
            if (!isExist)
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

            if(param.detail) {
                const productDetailDb = new ProductDetailDb()
                productDetailDb.color = param.detail.color
                productDetailDb.size = param.detail.size
                productDetailDb.productId = id

                const productDetailId = await this._productDetailRepository.create(productDetailDb)
                if(!productDetailId) 
                    return left(new CreateProductErrors.DataCannotSave())
            }

            const tagsDb = await this._tagRepository.getTagsName()
            const tags = tagsDb.map(tagDb => TagMapper.toDomain(tagDb))

            if (param.tags) {
                const filteredTags = param.tags.filter(tag => tags.map(t => t.name).indexOf(tag) === -1)
                let existTags = tagsDb.filter(tag => param.tags.includes(tag.name)).map(tag => tag.id)

                if (filteredTags.length > 0) {
                    const tagsDb = filteredTags.map(tag => {
                        let tagDb = new TagDb()
                        tagDb.name = tag
                        return tagDb
                    })

                    const tagsId = await this._tagRepository.createMultiple(tagsDb)
                    existTags = existTags.concat(tagsId)
                }

                const productTagsDb = existTags.map(tagId => {
                    const productTagDb = new ProductTagDb()
                    productTagDb.productId = id
                    productTagDb.tagId = tagId
                    return productTagDb
                })

                await this._productTagRepository.createMultiple(productTagsDb)
            }
            return right(Result.OK(id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
