import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { ProductDb } from "./ProductDb";
import { UserDb } from "./UserDb";

@Entity('product_favorite')
export class ProductFavoriteDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
    
    @ManyToOne(() => UserDb, user => user.productFavorites)
    @JoinColumn({ name: 'user_id' })
    user: UserDb;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => ProductDb, product => product.productFavorites)
    @JoinColumn({ name: 'product_id' })
    product: ProductDb;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'status', type: 'boolean', default: false })
    status: boolean;
}
