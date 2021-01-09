import { CategoryDb } from './databases/typeorm/entities/CategoryDb';
import { Category } from '../domain/aggregateRoot/Category';
import { CategoryName } from '../domain/valueObjects/CategoryName';
import { IMapper } from './../../../shared/IMapper';
import { UniqueEntityId } from '../../../shared/core/UniqueEntityId';

export class CategoryMapper implements IMapper<Category> {

  public static toDomain (categoryDb: CategoryDb): Category | null{
    const categoryNameOrError = CategoryName.create({ name: categoryDb.name })

    const categoryOrError = Category.create(
        { name: categoryNameOrError.getValue() }, 
        new UniqueEntityId(categoryDb.id)
    )

    if(categoryOrError.isFailure)
        console.log(categoryOrError.error)
    
    return categoryOrError.isSuccess ? categoryOrError.getValue() : null
  }
}
