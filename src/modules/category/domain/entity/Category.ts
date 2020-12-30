import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany} from "typeorm";
import { BaseEntity } from "../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { Product } from "../../../product/domain/entity/Product";

@Entity('category')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;
    
    @OneToMany(() => Product, products => products.category)
    products!: Product[]
}
