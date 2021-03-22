import { Service } from "typedi";
import { ProductDetailDb } from "../../../../../../infra/ProductDetailDb";
import { BaseRepository } from "../../../../../../shared/repository/BaseRepository";
import { IProductDetailRepository } from "../adapter/IProductDetailRepository";

@Service('product_detail.repository')
export class ProductDetailRepository extends BaseRepository<ProductDetailDb, string> implements IProductDetailRepository {
    constructor() {
        super(ProductDetailDb, {
            TABLE_NAME: 'product_detail'
        })
    }
}
