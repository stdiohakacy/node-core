import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../../../../shared/infra/databases/typeorm/entity/BaseEntity';
import { ChannelDb } from './ChannelDb';

@Entity({ name: 'channel_user' })

export class ChannelUserDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => ChannelDb, channel => channel.channelUsers)
    @JoinColumn({ name: 'channel_id' })
    channel: ChannelDb;
    
    @Column({ name: 'channel_id', type: 'uuid' })
    channelId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'is_mute', type: 'boolean', default: false })
    isMute: boolean;
}
