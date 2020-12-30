import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn} from "typeorm";
import { Category } from "../../../category/domain/entity/Category";

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;

    @Column({ name: 'price', type: 'integer' })
    price!: number;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category!: Category;
}
