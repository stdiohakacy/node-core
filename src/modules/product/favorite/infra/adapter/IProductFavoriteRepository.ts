import { ProductFavoriteDb } from "../../../../../infra/ProductFavoriteDb";
import { IBaseRepository } from "../../../../../shared/repository/BaseRepository";

export interface IProductFavoriteRepository extends IBaseRepository<ProductFavoriteDb, string> {
    isExist(userId: string, productId: string): Promise<boolean>
}