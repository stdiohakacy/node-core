import { PrivateMessageDb } from './databases/typeorm/entities/PrivateMessageDb';
import { PrivateMessage } from "../private/domain/aggregateRoot/PrivateMessage"
import { IMapper } from "../../../shared/IMapper"
import { UserId } from '../../user/domain/entity/UserId';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { PrivateMessageMsg } from '../private/domain/valueObjects/PrivateMessageMsg';

export class PrivateMessageMapper implements IMapper<PrivateMessage> {
    public static toDomain(privateMessageDb: PrivateMessageDb): PrivateMessage | null {
        if (!privateMessageDb)
            return null
        const privateMessageOrError = PrivateMessage.create({
            fromUserId: privateMessageDb.fromUserId
                ? UserId.create(new UniqueEntityId(privateMessageDb.fromUserId)).getValue()
                : null,
            toUserId: privateMessageDb.toUserId
                ? UserId.create(new UniqueEntityId(privateMessageDb.toUserId)).getValue()
                : null,
            message: privateMessageDb.message
                ? PrivateMessageMsg.create({ value: privateMessageDb.message }).getValue()
                : null
        }, new UniqueEntityId(privateMessageDb.id))

        if (privateMessageOrError.isFailure)
            console.error(privateMessageOrError.error)

        return privateMessageOrError.isSuccess
            ? privateMessageOrError.getValue()
            : null
    }

    public static toPersistence(privateMessage: PrivateMessage): PrivateMessageDb {
        const privateMessageDb = new PrivateMessageDb()

        privateMessageDb.toUserId = privateMessage.toUserId && privateMessage.toUserId.id.toString()
        privateMessageDb.fromUserId = privateMessage.fromUserId && privateMessage.fromUserId.id.toString()
        privateMessageDb.message = privateMessage.privateMessageMsg && privateMessage.privateMessageMsg.value

        return privateMessageDb
    }
}
