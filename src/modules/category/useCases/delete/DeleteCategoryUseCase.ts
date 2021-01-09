import { CategoryId } from './../../domain/entity/CategoryId';
import { IDeleteCategoryDTO } from './IDeleteCategoryDTO';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { IUseCase } from '../../../../shared/core/IUserCase';
import { left, Result, right } from '../../../../shared/core/Result';
import { CategoryName } from '../../domain/valueObjects/CategoryName';
import { Category } from '../../domain/aggregateRoot/Category';
import { CategoryDb } from '../../infra/databases/typeorm/entities/CategoryDb';
import { CategoryMapper } from '../../infra/CategoryMapper';
import { DeleteCategoryResponse } from './DeleteCategoryResponse';
import { UniqueEntityId } from '../../../../shared/core/UniqueEntityId';
import { DeleteCategoryErrors } from './DeleteCategoryErrors';
import { ApplicationError } from '../../../../shared/core/ApplicationError';

export class DeleteCategoryUseCase implements IUseCase<IDeleteCategoryDTO, Promise<DeleteCategoryResponse>> {
    private _categoryRepository: CategoryRepository
    
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }
    
    async execute(param: IDeleteCategoryDTO): Promise<DeleteCategoryResponse> {
        const idOrError = CategoryId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure) {
            return left(Result.fail(idOrError.error)) as DeleteCategoryResponse;
        }
        const categoryId: CategoryId = idOrError.getValue()

        try {
            const isExist = await this._categoryRepository.getById(categoryId.id.toString())
            if(!isExist) {
                return left(
                    new DeleteCategoryErrors.NotFoundError(param.id)
                ) as DeleteCategoryResponse
            }
        } 
        catch (error) {
            console.log(error)    
            return left(new ApplicationError.UnexpectedError(error))
        }

        const categoryDb = new CategoryDb()
        categoryDb.deletedAt = new Date()

        const isDeleted = await this._categoryRepository.update(param.id, categoryDb)

        return right(Result.OK(isDeleted ? true : false))
    }
}
