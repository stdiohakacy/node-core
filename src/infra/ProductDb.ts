import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { CategoryDb } from "./CategoryDb";
import { ProductDetailDb } from "./ProductDetailDb";
import { ProductFavoriteDb } from "./ProductFavoriteDb";
import { ProductTagDb } from "./ProductTagDb";

@Entity('product')
export class ProductDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @ManyToOne(() => CategoryDb, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryDb;

    @OneToMany(() => ProductTagDb, productTags => productTags.product)
    productTags: ProductTagDb[];

    @OneToMany(() => ProductFavoriteDb, productFavorites => productFavorites.product)
    productFavorites: ProductFavoriteDb[];

    @OneToMany(() => ProductDetailDb, productDetails => productDetails.product)
    productDetails: ProductDetailDb[];

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId!: string;

    @Column({ name: 'name', length: 150 })
    name: string;

    @Column({ name: 'price', type: 'integer' })
    price: number;
}
