import { IMapper } from "../../../../shared/IMapper";
import { ChannelUser } from "../domain/entity/ChannelUser";
import { ChannelUserDb } from "./databases/typeorm/entities/ChannelUserDb";

export class ChannelUserMapper implements IMapper<ChannelUser> {
    public static toPersistence(channelUser: ChannelUser): ChannelUserDb {
        const channelUserDb = new ChannelUserDb()

        channelUserDb.channelId = channelUser.channelId && channelUser.channelId.id.toString()
        channelUserDb.userId = channelUser.userId && channelUser.userId.id.toString()
        channelUserDb.isMute = channelUser.isMute

        return channelUserDb
    }
}
