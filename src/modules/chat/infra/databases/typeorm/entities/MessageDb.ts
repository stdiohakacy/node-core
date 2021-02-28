import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../../../../shared/infra/databases/typeorm/entity/BaseEntity';
import { UserDb } from '../../../../../user/infra/databases/typeorm/entities/UserDb';
import { MESSAGE_STATUS } from '../../../../definition/MessageStatus';

@Entity({ name: 'message' })
export class MessageDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;
    
    @Column({ name: 'channel_id', type: 'uuid' })
    channelId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'parent_message_id', type: 'uuid', nullable: true })
    parentMessageId: string;

    @Column({ name: 'content', type: 'varchar', nullable: true })
    content: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: MESSAGE_STATUS,
        default: MESSAGE_STATUS.SENT,
    })
    status: MESSAGE_STATUS;

    @Column({ name: 'is_pin', type: 'boolean', default: false })
    isPin: boolean;

    @Column({ name: 'is_star', type: 'boolean', default: false })
    isStar: boolean;

    @ManyToOne(() => UserDb, { nullable: true })
    @JoinColumn({ name: 'user_Id' })
    user?: UserDb;
}
