import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { UserDb } from "../../../../../user/infra/databases/typeorm/entities/UserDb";

@Entity('private_message')
export class PrivateMessageDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => UserDb, fromUser => fromUser.frU_privateMessages)
    @JoinColumn({ name: 'from_user_id' })
    fromUser: UserDb;

    @Column({ name: 'from_user_id', type: 'uuid' })
    fromUserId: string

    @ManyToOne(() => UserDb, toUser => toUser.toU_privateMessages)
    @JoinColumn({ name: 'to_user_id' })
    toUser: UserDb;

    @Column({ name: 'to_user_id', type: 'uuid' })
    toUserId: string

    @Column({ name: 'message', type: 'text', nullable: false, default: '' })
    message: string;

    @Column({name: 'attachments', type: 'simple-array', default: [], nullable: true})
    attachments: string[]
}
