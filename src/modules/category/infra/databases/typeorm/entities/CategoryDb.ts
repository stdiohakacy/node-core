import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from "typeorm";
import { Product } from "../../../../../product/infra/databases/typeorm/entities/Product";

@Entity('category')
export class CategoryDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;
    
    @OneToMany(() => Product, products => products.category)
    products!: Product[]
}
