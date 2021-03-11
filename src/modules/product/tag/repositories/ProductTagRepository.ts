import { Service } from "typedi";
import { ProductTagDb } from "../../../../infra/ProductTagDb";
import { BaseRepository } from "../../../../shared/repository/BaseRepository";
import { IProductTagRepository } from "../adapter/IProductTagRepository";

@Service('product_tag.repository')
export class ProductTagRepository extends BaseRepository<ProductTagDb, string> implements IProductTagRepository {
    constructor() {
        super(ProductTagDb, {
            TABLE_NAME: 'product_tag'
        })
    }
}
