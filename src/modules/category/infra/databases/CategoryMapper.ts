import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId"
import { IMapper } from "../../../../shared/IMapper"
import { Category } from "../../domain/aggregateRoots/Category"
import { CategoryName } from "../../domain/valueObjects/CategoryName"
import { CategoryDb } from "./typeorm/entities/CategoryDb"

export class CategoryMapper implements IMapper<Category> {
    public static toDomain (categoryDb: CategoryDb): Category | null {
        const categoryNameOrError = CategoryName.create({ value: categoryDb.name })

        const categoryOrError = Category.create({ name: categoryNameOrError.getValue() },
            new UniqueEntityId(categoryDb.id)
        )

        if(categoryOrError.isFailure)
            console.log(categoryOrError.error)
        return categoryOrError.isSuccess ? categoryOrError.getValue() : null
    }

    public static toPersistence (category: Category): CategoryDb {
        const categoryDb = new CategoryDb()

        categoryDb.name = category.name && category.name.value

        return categoryDb
    }
}
