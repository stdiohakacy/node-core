import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { UserDb } from "../../../../../user/infra/databases/typeorm/entities/UserDb";

@Entity('from_user_to_user')
export class FromUserToUserDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => UserDb, fromUser => fromUser.frU_fromUsersToUsers)
    @JoinColumn({ name: 'from_user_id' })
    fromUser: UserDb;

    @Column({ name: 'from_user_id', type: 'uuid' })
    fromUserId: string

    @ManyToOne(() => UserDb, toUser => toUser.toU_fromUsersToUsers)
    @JoinColumn({ name: 'to_user_id' })
    toUser: UserDb;

    @Column({ name: 'to_user_id', type: 'uuid' })
    toUserId: string

    @Column({ name: 'remark', length: 10, nullable: true, default: '' })
    remark: string
    
    @Column({ name: 'shield', length: 1, type: 'char' , nullable: true, default: '' })
    shield: string
}
