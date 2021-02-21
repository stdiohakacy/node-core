import { PrimaryGeneratedColumn } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../../../../shared/infra/databases/typeorm/entity/BaseEntity';
import { UserDb } from '../../../../../../user/infra/databases/typeorm/entities/UserDb';
import { MESSAGE_STATUS } from '../../../../enums/MessageStatus';
import { MESSAGE_TYPE } from '../../../../enums/MessageType';

@Entity({ name: 'message' })
export class MessageDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId: string;

    @ManyToOne(() => UserDb, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: UserDb;

    @Column({ name: 'channel_id', type: 'uuid' })
    channelId: string;

    @Column({ name: 'parent_message_id', type: 'uuid', nullable: true })
    parentMessageId: string;

    @Column({ name: 'content', type: 'varchar', nullable: true })
    content: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: MESSAGE_TYPE,
        default: MESSAGE_TYPE.CHAT,
    })
    type: MESSAGE_TYPE;

    @Column({
        name: 'status',
        type: 'enum',
        enum: MESSAGE_STATUS,
        default: MESSAGE_STATUS.SENT,
    })
    status: MESSAGE_STATUS;

    @Column({
        name: 'system_message',
        type: 'simple-json',
        nullable: true,
    })
    systemMessage: { [key: string]: any };

    @Column({ name: 'is_pin', type: 'boolean', default: false })
    isPin: boolean;

    @Column({ name: 'is_star', type: 'boolean', default: false })
    isStar: boolean;
}
