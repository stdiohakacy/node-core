import { Result, right } from './../../../../../shared/core/Result';
import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { left } from "../../../../../shared/core/Result";
import { CategoryRepository } from "../../../../category/infra/repositories/CategoryRepository";
import { FindProductsByCategoryQueryDTO } from "../../../dtos/FindProductsByCategoryQueryDTO";
import { FindProductsByCategoryErrors } from "./FindProductsByCategoryErrors";
import { FindProductsByCategoryResponse } from "./FindProductsByCategoryResponse";
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { ProductMapper } from '../../../infra/databases/ProductMapper';
import { PaginationResult } from '../../../../../shared/core/PaginationResult';

@Service()
export class FindProductsByCategoryUseCase
    implements IUseCaseQueryCQRS<FindProductsByCategoryQueryDTO, Promise<FindProductsByCategoryResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository;

    async execute(param: FindProductsByCategoryQueryDTO): Promise<FindProductsByCategoryResponse> {
        try {
            if (!param.categoryId) {
                return left(Result.fail(new SystemError(MessageError.PARAM_REQUIRED, 'category id').message))
            }

            try {
                const isCategoryExist = await this._categoryRepository.isExist(param.categoryId)
                if (!isCategoryExist) {
                    return left(new FindProductsByCategoryErrors.NotFoundError(param.categoryId))
                }

                const [products, count] = await this._productRepository.findByCategory(param, param.categoryId)

                const list = products.map(product => ProductMapper.toDomain(product))
                const pagination = new PaginationResult(list, count, param.skip, param.limit)

                return right(Result.OK(pagination))
            } catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError())
            }
        }
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
