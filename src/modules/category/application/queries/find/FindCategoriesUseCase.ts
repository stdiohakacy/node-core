import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { PaginationResult } from "../../../../../shared/core/PaginationResult";
import { left, Result, right } from "../../../../../shared/core/Result";
import { FindCategoriesQueryDTO } from "../../../dtos/FindCategoriesQueryDTO";
import { CategoryMapper } from "../../../infra/databases/CategoryMapper";
import { CategoryRepository } from "../../../infra/repositories/CategoryRepository";
import { FindCategoriesResponse } from "./FindCategoriesResponse";

@Service()
export class FindCategoriesUseCase implements IUseCaseQueryCQRS<FindCategoriesQueryDTO, Promise<FindCategoriesResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository;

    async execute(param: FindCategoriesQueryDTO): Promise<FindCategoriesResponse> {
        try {
            const [categories, count] = await this._categoryRepository.findAndCount(param)
            const list = categories.map(category => CategoryMapper.toDomain(category))
            const pagination = new PaginationResult(list, count, param.skip, param.limit)

            return right(Result.OK(pagination))
        } 
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
