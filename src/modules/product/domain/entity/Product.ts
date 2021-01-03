import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn} from "typeorm";
import { CategoryDb } from "../../../category/domain/entity/CategoryDb";

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

    @ManyToOne(() => CategoryDb, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category!: CategoryDb;
}
