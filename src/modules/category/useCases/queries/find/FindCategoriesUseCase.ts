import { FindCategoriesResponse } from './FindCategoriesResponse';
import { IFindCategoriesDTO } from './IFindCategoriesDTO';
import { Inject, Service } from "typedi";
import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { IUseCase } from "../../../../../shared/core/IUserCase";
import { left, Result, right } from "../../../../../shared/core/Result";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";

@Service()
export class GetCategoryByIdUseCase implements IUseCase<IFindCategoriesDTO, Promise<FindCategoriesResponse>> {
    @Inject('category.repository')
    private readonly _categoryRepository: ICategoryRepository;

    async execute(param: IFindCategoriesDTO): Promise<FindCategoriesResponse> {
        try {
            const [categories, count] = await this._categoryRepository.findAndCount(param)
        } 
        catch (error) {
            return left(new ApplicationError.UnexpectedError(error)) as FindCategoriesResponse
        }
    }
}
