import { TagDb } from './../../../infra/TagDb';
import { IMapper } from "../../../shared/IMapper"
import { Tag } from "./entities/Tag";
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';

export class TagMapper implements IMapper<Tag> {
    public static toDomain(tagDb: TagDb): Tag | null {
        if(!tagDb) return null

        const tagOrError = Tag.create({
            name: tagDb.name
        }, new UniqueEntityId(tagDb.id))

        if(tagOrError.isFailure)
            console.error(tagOrError.error)
        return tagOrError.isSuccess ? tagOrError.getValue() : null
    }

    // public static toDomain (productDb: ProductDb): Product | null {
    //     if(!productDb)
    //         return null
    //     const productOrError = Product.create({
    //         name: ProductName.create({value: productDb.name}).getValue(),
    //         price: ProductPrice.create({value: productDb.price}).getValue(),
    //         categoryId: CategoryId.create(new UniqueEntityId(productDb.categoryId)).getValue() 
    //     }, new UniqueEntityId(productDb.id))

    //     if(productOrError.isFailure)
    //         console.error(productOrError.error)

    //     return productOrError.isSuccess ? productOrError.getValue() : null
    // }

    // public static toPersistence (product: Product): ProductDb {
    //     const productDb = new ProductDb()

    //     if(product.name.value) 
    //         productDb.name = product.name.value
    //     if(product.price.value)
    //         productDb.price = product.price.value
    //     if(product.categoryId.id.toString())
    //         productDb.categoryId = product.categoryId.id.toString()

    //     console.log(productDb)
    //     return productDb
    // }
}
