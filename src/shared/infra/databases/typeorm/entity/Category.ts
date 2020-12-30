import { Product } from './Product';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany} from "typeorm";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;

    @CreateDateColumn({name: 'created_at', type: 'timestamptz'})
    createdAt!: Date

    @UpdateDateColumn({name: 'updated_at', type: 'timestamptz'})
    updatedAt!: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt?: Date
    
    @OneToMany(() => Product, products => products.category)
    products!: Product[]
}
