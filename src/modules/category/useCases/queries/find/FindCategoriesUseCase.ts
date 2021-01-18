import { PaginationResult } from './../../../../../shared/core/PaginationResult';
import { FindCategoriesResponse } from './FindCategoriesResponse';
import { FindCategoriesDTO } from './FindCategoriesDTO';
import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCase } from "../../../../../shared/core/IUserCase";
import { left, Result, right } from "../../../../../shared/core/Result";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";
import { CategoryMapper } from '../../../infra/CategoryMapper';
import { Category } from '../../../domain/aggregateRoot/Category';

@Service()
export class FindCategoriesUseCase implements IUseCase<FindCategoriesDTO, Promise<FindCategoriesResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

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
