import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from "typeorm";
import { ProductDb } from "../../../../../product/infra/databases/typeorm/entities/ProductDb";

@Entity('category')
export class CategoryDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;
    
    @OneToMany(() => ProductDb, products => products.category)
    products!: ProductDb[]
}
