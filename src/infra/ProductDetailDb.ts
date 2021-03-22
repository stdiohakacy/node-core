import { ProductColor } from '../modules/product/components/detail/enum/ProductColor';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { ProductDb } from "./ProductDb";

@Entity('product_detail')
export class ProductDetailDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @ManyToOne(() => ProductDb, product => product.productDetails)
    @JoinColumn({ name: 'product_id' })
    product: ProductDb;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'size', nullable: true })
    size: number

    @Column({
        name: "color",
        type: "enum",
        enum: ProductColor,
        nullable: true
    })
    color: ProductColor
}
