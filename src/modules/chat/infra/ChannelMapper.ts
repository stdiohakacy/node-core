import { UniqueEntityId } from "../../../shared/domain/UniqueEntityId"
import { IMapper } from "../../../shared/IMapper"
import { Channel } from "../domain/aggregateRoot/Channel"
import { ChannelDescription } from "../domain/valueObjects/ChannelDescription"
import { ChannelName } from "../domain/valueObjects/ChannelName"
import { ChannelDb } from "./databases/typeorm/entities/ChannelDb"

export class ChannelMapper implements IMapper<Channel> {
    public static toDomain(channelDb: ChannelDb): Channel | null {
        if (!channelDb)
            return null
        const channelOrError = Channel.create({
            name: channelDb.name ? ChannelName.create({ value: channelDb.name }).getValue() : null,
            description: channelDb.description ? ChannelDescription.create({ value: channelDb.description }).getValue() : null,
            isDirect: channelDb.isDirect,
            isPrivate: channelDb.isPrivate,
            lastSeen: channelDb.lastSeen,
            lastMessageId: channelDb.lastMessageId,
            lastMessageCreatedAt: channelDb.lastMessageCreatedAt
        }, new UniqueEntityId(channelDb.id))

        if (channelOrError.isFailure)
            console.error(channelOrError.error)

        return channelOrError.isSuccess ? channelOrError.getValue() : null
    }

    public static toPersistence(channel: Channel): ChannelDb {
        const channelDb = new ChannelDb()

        channelDb.name = channel.name && channel.name.value
        channelDb.description = channel.description && channel.description.value
        channelDb.isDirect = channel.isDirect
        channelDb.isPrivate = channel.isPrivate
        channelDb.lastSeen = channel.lastSeen && channel.lastSeen.value
        channelDb.lastMessageId = channel.lastMessageId
        channelDb.lastMessageCreatedAt = channel.lastMessageCreatedAt

        return channelDb
    }
}
