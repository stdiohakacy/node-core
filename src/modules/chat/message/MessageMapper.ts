import { UniqueEntityId } from "../../../shared/domain/UniqueEntityId"
import { IMapper } from "../../../shared/IMapper"
import { UserId } from "../../user/domain/entity/UserId"
import { ChannelId } from "../channel/domain/entity/ChannelId"
import { MessageDb } from "../channel/infra/databases/typeorm/entities/MessageDb"
import { Message } from "./Message"
import { MessageContent } from "./MessageContent"

export class MessageMapper implements IMapper<Message> {
    public static toDomain(messageDb: MessageDb): Message | null {
        if (!messageDb)
            return null
        const messageOrError = Message.create({
            content: messageDb.content ? MessageContent.create({value: messageDb.content}).getValue() : null,
            channelId: ChannelId.create(new UniqueEntityId(messageDb.channelId)).getValue(),
            userId: UserId.create(new UniqueEntityId(messageDb.userId)).getValue(),
        }, new UniqueEntityId(messageDb.id))

        if (messageOrError.isFailure)
            console.error(messageOrError.error)

        return messageOrError.isSuccess ? messageOrError.getValue() : null
    }

    public static toPersistence(message: Message): MessageDb {
        const messageDb = new MessageDb()

        if(message.content)
            messageDb.content = message.content.value
        if(message.channelId)
            messageDb.channelId = message.channelId.id.toString()
        if(message.userId)
            messageDb.userId = message.userId.id.toString()

        return messageDb
    }
}
