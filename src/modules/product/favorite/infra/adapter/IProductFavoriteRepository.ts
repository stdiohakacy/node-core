import { ProductFavoriteDb } from "../../../../../infra/ProductFavoriteDb";
import { IBaseRepository } from "../../../../../shared/repository/BaseRepository";

export interface IProductFavoriteRepository extends IBaseRepository<ProductFavoriteDb, string> {
    isIdExist(id: string): Promise<boolean>
    isExist(userId: string, productId: string): Promise<boolean>
}