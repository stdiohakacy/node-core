import { ProductDetailDb } from './../../../../../../infra/ProductDetailDb';
import { IBaseRepository } from "../../../../../../shared/repository/BaseRepository";

export interface IProductDetailRepository extends IBaseRepository<ProductDetailDb, string> {}