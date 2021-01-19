import { PaginationResult } from '../../../../../shared/core/PaginationResult';
import { FindCategoriesResponse } from './FindCategoriesResponse';
import { FindCategoriesDTO } from './FindCategoriesDTO';
import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { left, Result, right } from "../../../../../shared/core/Result";
import { CategoryMapper } from '../../../infra/CategoryMapper';
import { Category } from '../../../domain/aggregateRoot/Category';
import { CategoryRepository } from '../../../repositories/CategoryRepository';

@Service()
export class FindCategoriesUseCase implements IUseCaseQueryCQRS<FindCategoriesDTO, Promise<FindCategoriesResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;

    async execute(param: FindCategoriesDTO): Promise<FindCategoriesResponse> {
        try {
            const [categories, count] = await this._categoryRepository.findAndCount(param)
            const list = categories.map(category => CategoryMapper.toDomain(category))
            const pagination = new PaginationResult(list, count, param.skip, param.limit)

            return right(Result.OK<PaginationResult<Category>>(pagination))
        } 
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error)) as FindCategoriesResponse
        }
    }
}
