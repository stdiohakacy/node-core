import { ChannelDb } from './../infra/databases/typeorm/entities/ChannelDb';
import { Service } from 'typedi';
import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { IBaseRepository } from "../../../shared/repository/IBaseRepository";

export interface IChannelRepository extends IBaseRepository<ChannelDb, string> {
    isChannelExist(id: string): Promise<boolean>
}

@Service('channel.repository')
export class ChannelRepository extends BaseRepository<ChannelDb, string> implements IChannelRepository {
    constructor() {
        super(ChannelDb, {
            TABLE_NAME: 'channel'
        })
    }
    async isChannelExist(id: string): Promise<boolean> {
        const channelCount = await this.repository.count({id})
        return channelCount > 0
    }
}
